from typing import Any
import uuid
import enum
import sqlalchemy as sa
import sqlalchemy.orm as orm
import sqlalchemy.dialects.postgresql as pg
import datetime
from sqlalchemy import create_mock_engine

import typeid

from .typeid import typeid_sql

class DATABASE_ROLES:
    __slots__ = ()
    backend_authenticated = "backend_authenticated"
    backend_anon = "backend_anon"

class Visibility_Type(enum.Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    HIDDEN = "hidden"


class Media_Type(enum.Enum):
    IMAGE = "image"
    VIDEO = "video"


class Member_Role(enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MODERATOR = "moderator"
    MEMBER = "member"


ProfileID = sa.UUID
ProfileIDT = uuid.UUID

JSON = pg.JSONB
TIMESTAMP = pg.TIMESTAMP(timezone=True)

schema = "public"

extensions = [
    """
CREATE EXTENSION IF NOT EXISTS postgis
WITH
  schema extensions;
"""
] + typeid_sql

typeids = {}
typeid_casts = {}

cast_from_type_s = f"(text AS typeid)"
cast_from_type = f"CREATE CAST {cast_from_type_s} WITH FUNCTION typeid_parse(text) AS IMPLICIT;"
typeid_casts[cast_from_type_s] = cast_from_type

cast_to_type_s = f"(typeid AS text)"
cast_to_type = f"CREATE CAST {cast_to_type_s} WITH FUNCTION typeid_print(typeid) AS ASSIGNMENT;"
typeid_casts[cast_to_type_s] = cast_to_type

policies: set[str] = set()

typeid_functions = {
    "base32_decode": "",
    "base32_encode": "",
    "uuid_generate_v7": "",
    "typeid_generate": "",
    "typeid_parse": "",
    "typeid_check": "",
    "typeid_print(uuid)": "",
    "typeid_print(typeid)": "",
    "compare_type_id_equality": "",
}

functions = {}
functions.update(typeid_functions)

triggers = {}

class TypeID(sa.types.UserDefinedType):
    cache_ok = True

    def __init__(self, name):
        super().__init__()
        self.name = name

    def get_col_spec(self, **kw):
        type_expression = kw.get("type_expression", None)
        return f"{self.name}"

    def bind_expression(self, bindvalue):
        return sa.func.typeid_parse(bindvalue, type_=self)

    def column_expression(self, col):
        return sa.func.typeid_print(col, type_=self)


IDType = TypeID
IDTypeT = str

class IdMixin:

    @classmethod
    def typeid_name(cls):
        return f"{cls.__tablename__}_id"

    @classmethod
    def typeid_check_name(cls):
        return cls.__tablename__.replace("_", "")

    @orm.declared_attr
    def id(cls) -> orm.Mapped[IDTypeT]:
        check_name = cls.typeid_check_name()
        type_name = cls.typeid_name()

        table_type = f"CREATE DOMAIN {type_name} AS typeid CHECK (typeid_check(value, '{check_name}'));"
        typeids[type_name] = table_type

        # postgresql ignores casts domains, but postgrest does not, so we define casts for the domain here
        cast_to_type_s = f"({type_name} AS text)"
        cast_to_type = f"CREATE CAST {cast_to_type_s} WITH FUNCTION typeid_print(typeid) AS IMPLICIT;"
        typeid_casts[cast_to_type_s] = cast_to_type


        return orm.mapped_column(IDType(type_name), primary_key=True, server_default=sa.func.typeid_generate(check_name))

    @classmethod
    def generate_id(cls):
        return str(typeid.TypeID(prefix=cls.typeid_check_name()))

class ExtraMixin:
    extra: orm.Mapped[dict] = orm.mapped_column(JSON, nullable=False, server_default=sa.text("'{}'"))



class ShortString(sa.String):
    def __init__(self, length: int = 100, **kwargs):
        super().__init__(length, **kwargs)

class IDString(ShortString):
    def __init__(self, length: int = 80, **kwargs):
        super().__init__(length, **kwargs)

class DefaultString(ShortString):
    def __init__(self, length: int = 255, **kwargs):
        super().__init__(length, **kwargs)

class LongString(DefaultString):
    def __init__(self, length: int = 5000, **kwargs):
        super().__init__(length, **kwargs)

class Enum(sa.Enum):
    def __init__(self, enum: enum.Enum, **kw: Any):
        super().__init__(enum,  values_callable=lambda x: [e.value for e in x], **kw)

class Geometry(sa.types.UserDefinedType):
    cache_ok = True

    def get_col_spec(self):
        return "GEOMETRY"

    def bind_expression(self, bindvalue):
        return sa.func.ST_GeomFromText(bindvalue, type_=self)

    def column_expression(self, col):
        return sa.func.ST_AsText(col, type_=self)


class Base(orm.DeclarativeBase):
    metadata = sa.MetaData(schema=schema)

    created_at: orm.Mapped[int] = orm.mapped_column(TIMESTAMP, nullable=False, server_default=sa.func.now())
    modified_at: orm.Mapped[int] = orm.mapped_column(TIMESTAMP, nullable=False, server_default=sa.func.now())


def create_many_to_many(cls_name: str, table_name: str, left: str | tuple[str, str], right: str | tuple[str, str], bases=(Base, IdMixin)):

    left_key = left[0] if isinstance(left, tuple) else left + "_id"
    right_key = right[0] if isinstance(right, tuple) else right + "_id"

    left_tbl = left[1] if isinstance(left, tuple) else left
    right_tbl = right[1] if isinstance(right, tuple) else right

    kw = {
        "__tablename__": table_name,
        left_key: orm.mapped_column(sa.ForeignKey(f"{left_tbl}.id", ondelete="CASCADE"), index=True, nullable=False),
        right_key: orm.mapped_column(sa.ForeignKey(f"{right_tbl}.id", ondelete="CASCADE"), index=True, nullable=False),
        "__table_args__": (
            sa.UniqueConstraint(left_key, right_key),
        )
    }

    cls = type(cls_name, bases, kw)

    return cls

def mutual_exclusive_check(table_name: str, *relations, allow_all_none=False):
    return sa.CheckConstraint(
        sa.or_(
            *[

                sa.and_(
                    r != None,
                    *[r2 == None for r2 in relations if r2 != r]
                )
                for r in relations
            ],
            *([sa.and_(
                *[r == None for r in relations]
            )] if allow_all_none else [])
        ),
        name=f"{table_name}_mutually_exclusive_relations"
    )

def create_private_policy(table: str | type[Base],
                       restrictive = False,
                       role = "service_role"
                       ):

    table = table.__tablename__ if not isinstance(table, str) else table

    as_ = 'RESTRICTIVE' if restrictive else 'PERMISSIVE'

    p = []

    p.append(f"""
        CREATE POLICY "Only {role} can access {table}."
        ON "{table}"
        AS {as_}
        FOR ALL
        TO {role}
        USING ( true )
        WITH CHECK ( true );
        """)

    if p:
        policies.add(f"""
                        ALTER TABLE "{table}" ENABLE ROW LEVEL SECURITY;
                        """)

    policies.update(p)


def create_user_read_policy(table: str | type[Base],
                              col: str = "id",
                       extra: list[str] | None = None):

    table = table.__tablename__ if not isinstance(table, str) else table


    p = [] + (extra or [])

    p.append(f"""
    CREATE POLICY "Users can view their own {table}."
    ON "{table}"
    FOR SELECT
    TO authenticated
    USING ( (select auth.uid()) = {col} );
    """)

    if p:
        policies.add(f"""
                        ALTER TABLE "{table}" ENABLE ROW LEVEL SECURITY;
                        """)

    policies.update(p)


functions["auth.register_row_modified"] = """
CREATE FUNCTION auth.register_row_modified()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
  BEGIN
    NEW.modified_at = NOW();
    RETURN NEW;
  END;
$$;
"""

triggers["on_row_modified"] = """
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.columns
        WHERE table_schema = 'public'
        GROUP BY table_name
    LOOP
        EXECUTE format('CREATE TRIGGER on_row_modified
                        BEFORE UPDATE ON public.%I
                        FOR EACH ROW EXECUTE PROCEDURE auth.register_row_modified()',
                        t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;
"""


class Media(Base, IdMixin):
    __tablename__ = "media"

    type: orm.Mapped[Media_Type] = orm.mapped_column(Enum(Media_Type), nullable=False)
    url: orm.Mapped[str] = orm.mapped_column(DefaultString, nullable=False, index=True)
    thumbnail_url: orm.Mapped[str] = orm.mapped_column(DefaultString, nullable=True)

    group_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("group.id", ondelete="CASCADE"), nullable=True)
    event_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("event.id", ondelete="CASCADE"), nullable=True)
    discussion_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("discussion.id", ondelete="CASCADE"), nullable=True)
    comment_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("comment.id", ondelete="CASCADE"), nullable=True)

    _table_args__ = (
            mutual_exclusive_check(__tablename__, group_id, event_id, discussion_id, comment_id, allow_all_none=True),
        )


class Profile(Base, ExtraMixin):
    __tablename__ = "profile"
    id: orm.Mapped[ProfileID] = orm.mapped_column(sa.ForeignKey("auth.users.id", ondelete="CASCADE"), primary_key=True)
    name: orm.Mapped[str] = orm.mapped_column(ShortString, nullable=False, server_default=sa.text("''"))
    occupation: orm.Mapped[str] = orm.mapped_column(ShortString, nullable=False, server_default=sa.text("''"))
    description: orm.Mapped[str] = orm.mapped_column(LongString, nullable=False, server_default=sa.text("''"))

    media_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("media.id", ondelete="SET NULL"), nullable=True)

create_user_read_policy(Profile)

# Inserts a row into public.profiles
functions["auth.handle_new_user"] = f"""
CREATE FUNCTION auth.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.{Profile.__tablename__} (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;
"""

# Trigger the function every time a user is created
triggers["on_auth_user_created"] = """
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE auth.handle_new_user();
"""

class Url(Base, IdMixin):
    __tablename__ = "url"

    name: orm.Mapped[str] = orm.mapped_column(DefaultString, nullable=False)


class Location(Base, IdMixin):
    __tablename__ = "location"

    name: orm.Mapped[str] = orm.mapped_column(ShortString, nullable=False, server_default=sa.text("''"))
    address: orm.Mapped[str] = orm.mapped_column(DefaultString, nullable=False, server_default=sa.text("''"))
    coords: orm.Mapped[str] = orm.mapped_column(Geometry, nullable=True)

    group_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("group.id", ondelete="CASCADE"), nullable=True)
    event_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("event.id", ondelete="CASCADE"), nullable=True)

    _table_args__ = (
        mutual_exclusive_check(__tablename__, group_id, event_id),
    )


class Group(Base, IdMixin):
    __tablename__ = "group"

    title: orm.Mapped[str] = orm.mapped_column(ShortString, nullable=False)
    content: orm.Mapped[str] = orm.mapped_column(LongString, nullable=False, server_default=sa.text("''"))
    visibility: orm.Mapped[Visibility_Type] = orm.mapped_column(Enum(Visibility_Type), nullable=False, server_default=sa.text(f"'{Visibility_Type.HIDDEN.value}'"))

    media_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("media.id", ondelete="SET NULL"), nullable=True)



class groupMembers(Base, IdMixin):
    __tablename__ = "group_members"

    group_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("group.id", ondelete="CASCADE"), index=True, nullable=False)
    profile_id: orm.Mapped[ProfileIDT] = orm.mapped_column(sa.ForeignKey("profile.id", ondelete="CASCADE"), index=True, nullable=False, server_default=sa.text("auth.uid()"))
    role: orm.Mapped[Member_Role] = orm.mapped_column(Enum(Member_Role), nullable=False, server_default=sa.text(f"'{Member_Role.MEMBER.value}'"))

    __table_args__ = (
        sa.UniqueConstraint("group_id", "profile_id"),
    )


groupUrls = create_many_to_many("groupUrls", "group_urls", "group", "url")

class Discussion(Base, IdMixin):
    __tablename__ = "discussion"

    title: orm.Mapped[str] = orm.mapped_column(ShortString, nullable=False)
    content: orm.Mapped[str] = orm.mapped_column(LongString, nullable=False)
    visibility: orm.Mapped[Visibility_Type] = orm.mapped_column(Enum(Visibility_Type), nullable=False, server_default=sa.text(f"'{Visibility_Type.PUBLIC.value}'"))

    group_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("group.id", ondelete="CASCADE"), nullable=False)
    event_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("event.id", ondelete="CASCADE"), nullable=True)
    profile_id: orm.Mapped[ProfileIDT] = orm.mapped_column(sa.ForeignKey("profile.id", ondelete="SET NULL"), nullable=True)


class Comment(Base, IdMixin):
    __tablename__ = "comment"

    content: orm.Mapped[str] = orm.mapped_column(LongString, nullable=False)

    discussion_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("discussion.id", ondelete="CASCADE"), nullable=False)
    profile_id: orm.Mapped[ProfileIDT] = orm.mapped_column(sa.ForeignKey("profile.id", ondelete="SET NULL"), index=True, nullable=True, server_default=sa.text("auth.uid()"))

class Reaction(Base, IdMixin):
    __tablename__ = "reaction"

    reaction: orm.Mapped[str] = orm.mapped_column(ShortString, nullable=False)

    profile_id: orm.Mapped[ProfileIDT] = orm.mapped_column(sa.ForeignKey("profile.id", ondelete="SET NULL"), nullable=True, server_default=sa.text("auth.uid()"))

    discussion_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("discussion.id", ondelete="CASCADE"), nullable=True)
    comment_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("comment.id", ondelete="CASCADE"), nullable=True)

    __table_args__ = (
        mutual_exclusive_check(__tablename__, discussion_id, comment_id),
    )

class Event(Base, IdMixin):
    __tablename__ = "event"

    title: orm.Mapped[str] = orm.mapped_column(ShortString, nullable=False)
    content: orm.Mapped[str] = orm.mapped_column(LongString, nullable=False, server_default=sa.text("''"))
    visibility: orm.Mapped[Visibility_Type] = orm.mapped_column(Enum(Visibility_Type), nullable=False, server_default=sa.text(f"'{Visibility_Type.PUBLIC.value}'"))
    start_time: orm.Mapped[datetime.datetime] = orm.mapped_column(TIMESTAMP, nullable=True)
    end_time: orm.Mapped[datetime.datetime] = orm.mapped_column(TIMESTAMP, nullable=True)

    group_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("group.id", ondelete="CASCADE"), nullable=False)

eventMembers = create_many_to_many("eventMembers", "event_members", "event", "profile")



class Tag(Base, IdMixin, ExtraMixin):
    __tablename__ = "tag"

    name: orm.Mapped[str] = orm.mapped_column(DefaultString, nullable=False, index=True, unique=True)

profileTags = create_many_to_many("profileTags", "profile_tags", "profile", "tag")

groupTags = create_many_to_many("groupTags", "group_tags", "group", "tag")

eventTags = create_many_to_many("eventTags", "event_tags", "event", "tag")

commentTags = create_many_to_many("commentTags", "comment_tags", "comment", "tag")

discussionTags = create_many_to_many("discussionTags", "discussion_tags", "discussion", "tag")


# Needs to be last so that all table names are captured
class History(Base, IdMixin, ExtraMixin):
    __tablename__ = "history"

    profile_id: orm.Mapped[ProfileIDT] = orm.mapped_column(ProfileID, nullable=True, server_default=sa.text("auth.uid()"))
    action: orm.Mapped[str] = orm.mapped_column(ShortString, nullable=False)
    row_id: orm.Mapped[str] = orm.mapped_column(IDString, nullable=False)
    table_name: orm.Mapped[str] = orm.mapped_column(ShortString, nullable=False)
    table_data: orm.Mapped[dict] = orm.mapped_column(sa.JSON, nullable=False, server_default=sa.text("'{}'"))

    @orm.declared_attr
    def __table_args__(cls):
        table_names = Base.metadata.tables.keys()
        exclude = [cls.__tablename__]
        tup = tuple([f"'{t.split('.')[1]}'" for t in table_names if t not in exclude])

        return (
            sa.CheckConstraint(
                sa.text(f"table_name in ({','.join(tup)})"),
                name=f"{cls.__tablename__}_table_name_check"
            ),
        )

functions["auth.record_db_update"] = f"""
CREATE FUNCTION auth.record_db_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public

AS $$
  DECLARE
    data jsonb;
  BEGIN
    IF (OLD is null) then
        data = to_jsonb(NEW) - 'id';
    ELSIF (NEW is null) then
        data = to_jsonb(OLD) - 'id';
    ELSE
        data = (SELECT jsonb_object_agg(O.key, N.value)
        FROM jsonb_each(to_jsonb(OLD)) O
            CROSS JOIN jsonb_each(to_jsonb(NEW)) N
        WHERE O.key = N.key AND O.value <> N.value);
    END IF;

    IF (TG_OP = 'DELETE') THEN
        INSERT INTO {History.__tablename__}(profile_id, action, row_id, table_name, table_data)
        VALUES (
            (select auth.uid()),
            TG_OP,
            CASE WHEN (pg_typeof(OLD.id)::text LIKE 'uuid')
                THEN OLD.id::text
                ELSE typeid_print(OLD.id)
            END,
            TG_TABLE_NAME,
            data
            );
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO {History.__tablename__}(profile_id, action, row_id, table_name, table_data)
        VALUES (
            (select auth.uid()),
            TG_OP,
            CASE WHEN (pg_typeof(NEW.id)::text LIKE 'uuid')
                THEN NEW.id::text
                ELSE typeid_print(NEW.id)
            END,
            TG_TABLE_NAME,
            data
            );
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO {History.__tablename__}(profile_id, action, row_id, table_name, table_data)
        VALUES (
            (select auth.uid()),
            TG_OP,
            CASE WHEN (pg_typeof(NEW.id)::text LIKE 'uuid')
                THEN NEW.id::text
                ELSE typeid_print(NEW.id)
            END,
            TG_TABLE_NAME,
            data
            );
    END IF;
    RETURN NULL; -- result is ignored since this is an AFTER trigger
  END;
$$;
"""

table_updates_to_ignore = [History.__tablename__]

triggers["on_db_update"] = f"""
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name NOT IN ({','.join([f"'{t}'" for t in table_updates_to_ignore])})
        GROUP BY table_name
    LOOP
        EXECUTE format('CREATE TRIGGER on_db_update
                        AFTER INSERT OR UPDATE OR DELETE ON public.%I
                        FOR EACH ROW EXECUTE PROCEDURE auth.record_db_update()',
                        t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;
"""


def create_extensions(engine: sa.Engine):

    with engine.connect() as conn:
        for s in extensions:
            try:
                conn.execute(sa.text(s))
                conn.commit()
            except Exception as e:
                print(e)
                breakpoint()
                if "already exists" not in str(e):
                    raise e
                conn.rollback()


def create_typeids(engine: sa.Engine):

    with engine.connect() as conn:
        for p in typeids.values():
            conn.execute(sa.text(p))
            conn.commit()

    with engine.connect() as conn:
        for p in typeid_casts.values():
            conn.execute(sa.text(p))
            conn.commit()

def create_policies(engine: sa.Engine):

    with engine.connect() as conn:
        for p in policies:
            conn.execute(sa.text(p))
            conn.commit()

def create_functions_and_triggers(engine: sa.Engine):

    with engine.connect() as conn:
        for f, f_sql in functions.items():
            if not f_sql:
                continue
            conn.execute(sa.text(f_sql))
        conn.commit()

    with engine.connect() as conn:
        for t in triggers.keys():
            conn.execute(sa.text(triggers[t]))
        conn.commit()

def create_tables(engine: sa.Engine):
    # add default policy on all tables
    roles = ["service_role", DATABASE_ROLES.backend_anon]
    for t in Base.metadata.tables.values():
        for r in roles:
            create_private_policy(t.name, role=r)

    Base.metadata.reflect(engine, schema="auth", only=["users"])

    Base.metadata.create_all(engine)

FUNC_ROLES = ["supabase_admin", "service_role", DATABASE_ROLES.backend_authenticated, DATABASE_ROLES.backend_anon]
REVOKE_FUNC_ROLES = ["anon", "authenticated"]

def create_roles(engine: sa.Engine):

    stmts = []

    # Create new roles
    authenticator = "authenticator"
    superuser = "postgres"

    stmts.append(f'''
    CREATE ROLE "{DATABASE_ROLES.backend_authenticated}" INHERIT IN ROLE "authenticated" bypassrls;
    GRANT "{DATABASE_ROLES.backend_authenticated}" to "{superuser}";
    GRANT "{DATABASE_ROLES.backend_authenticated}" to "{authenticator}";
    ''')
    stmts.append(f'''
    CREATE ROLE "{DATABASE_ROLES.backend_anon}" INHERIT IN ROLE "anon" bypassrls;
    GRANT "{DATABASE_ROLES.backend_anon}" to "{superuser}";
    GRANT "{DATABASE_ROLES.backend_anon}" to "{authenticator}";
    ''')


    with engine.connect() as conn:
        for s in stmts:
            conn.execute(sa.text(s))
        conn.commit()

def set_privileges(engine: sa.Engine):
    "See https://github.com/orgs/supabase/discussions/4547"


    stmts = []

    dbname = "postgres"
    role = "anon"
    schemas = ["public", "storage"]

    # schemas to allow public functions
    allow_public_functions_schemas = []

    stmts.append(
    f'REVOKE ALL PRIVILEGES ON DATABASE "{dbname}" FROM "{role}";'
    + "\n" +
    "\n".join([f'REVOKE ALL PRIVILEGES ON SCHEMA "{s}" FROM "{role}";' for s in schemas])
    + "\n" +
    "\n".join([f'REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "{s}" FROM "{role}";' for s in schemas])
    + "\n" +
    "\n".join([f'REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA "{s}" FROM "{role}";' for s in schemas if s not in allow_public_functions_schemas])
    + "\n" +
    "\n".join([f'REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA "{s}" FROM "{role}";' for s in schemas])
    )

    # set default privileges for new public functions
    stmts.append(
      f"""
      ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM public;
      """
    )
    stmts.extend([f'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO "{r}"' for r in FUNC_ROLES])



    for r in REVOKE_FUNC_ROLES:
        stmts.append(
            f"""
            REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM "{r}";
            """
        )

    # allow roles for public functions

    for f in functions.keys():
        if len(f.split(".")) > 1 and f.split(".")[0] != "public":
            continue


        for r in FUNC_ROLES:
            stmts.append(
                f"""
                GRANT EXECUTE ON FUNCTION {f} TO "{r}";
                """
            )

    # allow some functions to be completely public
    completely_public_functions = [*typeid_functions.keys()]

    for f in completely_public_functions:
        for r in REVOKE_FUNC_ROLES:
            stmts.append(
                f"""
                GRANT EXECUTE ON FUNCTION {f} TO "{r}";
                """
            )

    with engine.connect() as conn:
        for s in stmts:
            conn.execute(sa.text(s))
        conn.commit()


def get_engine():
    port = 8482
    pw = "your-super-secret-and-long-postgres-password"
    return sa.create_engine(f"postgresql://postgres:{pw}@127.0.0.1:{port}/postgres", echo=True)

RESET_SQL = f"""
DO $$
DECLARE
    table_rec RECORD;
BEGIN
    FOR table_rec IN (
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = '{schema}' AND table_catalog = current_database()
    ) LOOP
        EXECUTE 'DROP TABLE IF EXISTS {schema}.' || table_rec.table_name || ' CASCADE';
    END LOOP;
END $$;

DELETE FROM auth.users;
"""

def reset_db(engine: sa.Engine):
    with engine.connect() as conn:
        conn.execute(sa.text(RESET_SQL))
        conn.commit()

    # enums

    with engine.connect() as conn:
        for e in (
            Visibility_Type,
            Media_Type,
            Member_Role,
        ):
            conn.execute(sa.text(f"DROP TYPE IF EXISTS {e.__name__.lower()};"))
        conn.commit()

    # functions (will cascade to triggers)

    with engine.connect() as conn:
        for f in functions.keys():
            conn.execute(sa.text(f"DROP FUNCTION IF EXISTS {f} CASCADE;"))
        conn.commit()

    # Typeids

    with engine.connect() as conn:
        for f in typeid_casts.keys():
            conn.execute(sa.text(f"DROP CAST IF EXISTS {f};"))
        conn.commit()

    with engine.connect() as conn:
        for f in typeids.keys():
            conn.execute(sa.text(f"DROP DOMAIN IF EXISTS {f} CASCADE;"))
        conn.commit()

    # Roles

    with engine.connect() as conn:
        for k, f in DATABASE_ROLES.__dict__.items():
            if k.startswith("_"):
                continue
            try:
              conn.execute(sa.text(f"DROP ROLE IF EXISTS {f};"))
            except Exception as e:
              conn.rollback()
              conn.execute(sa.text(f"DROP OWNED BY {f};"))
              conn.execute(sa.text(f"DROP ROLE IF EXISTS {f};"))
            conn.commit()

    return True

def dump_sql(metadata):

    stmts = []

    # required for auth.users
    class Users(Base):
        __tablename__ = "users"
        __table_args__ = {"schema": "auth"}

        id: orm.Mapped[sa.UUID] = orm.mapped_column(sa.UUID, primary_key=True, server_default=sa.func.uuid_generate_v4())

    engine = create_mock_engine("postgresql+psycopg2://", lambda s, *a, **kw: stmts.append(str(s.compile(dialect=engine.dialect))))
    metadata.create_all(engine, checkfirst=False)

    return "\n\n".join(stmts)


def main():

    engine = get_engine()

    if reset_db(engine):
        create_roles(engine)
        create_extensions(engine)
        create_typeids(engine)
        create_tables(engine)
        create_functions_and_triggers(engine)
        set_privileges(engine)

        create_policies(engine)


if __name__ == '__main__':
    main()
