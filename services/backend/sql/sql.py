from typing import Any
import uuid
import enum
import sqlalchemy as sa
import sqlalchemy.orm as orm
import sqlalchemy.dialects.postgresql as pg
import datetime
from sqlalchemy import create_mock_engine

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


JSON = pg.JSONB
TIMESTAMP = pg.TIMESTAMP(timezone=True)

schema = "public"

IDType = sa.UUID
IDTypeT = uuid.UUID

extensions = [
    """
create extension if not exists postgis
with
  schema extensions;
"""
]

policies = [
]

functions = {}
triggers = {}

public_read_policy = lambda table: f"""
CREATE POLICY "Public {table} are viewable by everyone."
  ON {table} for SELECT
  USING ( true );

CREATE POLICY "Users can insert their own {table}."
  ON {table} for INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own {table}."
  ON {table} for UPDATE
  USING ( auth.uid() = id );
"""

class IdMixin:
    id: orm.Mapped[IDTypeT] = orm.mapped_column(IDType, primary_key=True, server_default=sa.func.uuid_generate_v4())

class ExtraMixin:
    extra: orm.Mapped[dict] = orm.mapped_column(JSON, nullable=False, server_default=sa.text("'{}'"))

class ShortString(sa.String):
    def __init__(self, length: int = 100, **kwargs):
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
    def get_col_spec(self):
        return "GEOMETRY"

    def bind_expression(self, bindvalue):
        return sa.func.ST_GeomFromText(bindvalue, type_=self)

    def column_expression(self, col):
        return sa.func.ST_AsText(col, type_=self)

class Base(orm.DeclarativeBase):
    _table_args__ = dict(schema=schema)

    created_at: orm.Mapped[int] = orm.mapped_column(TIMESTAMP, nullable=False, server_default=sa.func.now())
    modified_at: orm.Mapped[int] = orm.mapped_column(TIMESTAMP, nullable=False, server_default=sa.func.now())


def create_many_to_many(cls_name: str, table_name: str, left: str | tuple[str, str], right: str | tuple[str, str], bases=(Base, IdMixin)):
    
    left_key = left[0] if isinstance(left, tuple) else left + "_id"
    right_key = right[0] if isinstance(right, tuple) else right + "_id"

    left_tbl = left[1] if isinstance(left, tuple) else left
    right_tbl = right[1] if isinstance(right, tuple) else right

    kw = {
        "__tablename__": table_name,
        left_key: orm.mapped_column(sa.ForeignKey(f"{left_tbl}.id", ondelete="CASCADE"), nullable=False),
        right_key: orm.mapped_column(sa.ForeignKey(f"{right_tbl}.id", ondelete="CASCADE"), nullable=False),
        "__table_args__": (
            sa.UniqueConstraint(left_key, right_key),
        )
    }

    cls = type(cls_name, bases, kw)

    return cls

def mutual_exclusive_check(table_name: str, *relations):
    return sa.CheckConstraint(
        sa.or_(
            *[

                sa.and_(
                    r != None,
                    *[r2 == None for r2 in relations if r2 != r]
                )
                for r in relations
            ]
        ),
        name=f"{table_name}_mutually_exclusive_relations"
    )

functions["public.register_row_modified"] = """
CREATE FUNCTION public.register_row_modified()
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
                        FOR EACH ROW EXECUTE PROCEDURE public.register_row_modified()',
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


class Profile(Base, ExtraMixin):
    __tablename__ = "profile"
    id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("auth.users.id", ondelete="CASCADE"), primary_key=True)
    name: orm.Mapped[str] = orm.mapped_column(ShortString, nullable=False, server_default=sa.text("''"))
    occupation: orm.Mapped[str] = orm.mapped_column(ShortString, nullable=False, server_default=sa.text("''"))
    description: orm.Mapped[str] = orm.mapped_column(LongString, nullable=False, server_default=sa.text("''"))
    media_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("media.id", ondelete="SET NULL"), nullable=True)

policies.append(f"""
ALTER TABLE {Profile.__tablename__} ENABLE ROW LEVEL SECURITY;

{public_read_policy(Profile.__tablename__)}
""")

# Inserts a row into public.profiles
functions["public.handle_new_user"] = f"""
CREATE FUNCTION public.handle_new_user()
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
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
"""


class Update(Base, IdMixin, ExtraMixin):
    __tablename__ = "update"

    profile_id: orm.Mapped[IDTypeT] = orm.mapped_column(IDType, nullable=True)
    action: orm.Mapped[str] = orm.mapped_column(ShortString, nullable=False)
    row_id: orm.Mapped[IDTypeT] = orm.mapped_column(IDType, nullable=False)
    table_name: orm.Mapped[str] = orm.mapped_column(ShortString, nullable=False)
    table_data: orm.Mapped[dict] = orm.mapped_column(JSON, nullable=False, server_default=sa.text("'{}'"))

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

    group_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("group.id", ondelete="CASCADE"), nullable=False)
    profile_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("profile.id", ondelete="CASCADE"), nullable=False)
    role: orm.Mapped[Member_Role] = orm.mapped_column(Enum(Member_Role), nullable=False, server_default=sa.text(f"'{Member_Role.MEMBER.value}'"))

    __table_args__ = (
        sa.UniqueConstraint("group_id", "profile_id"),
    )

groupMedias = create_many_to_many("groupMedias", "group_medias", "group", "media")

groupUrls = create_many_to_many("groupUrls", "group_urls", "group", "url")

class Discussion(Base, IdMixin):
    __tablename__ = "discussion"

    title: orm.Mapped[str] = orm.mapped_column(ShortString, nullable=False)
    content: orm.Mapped[str] = orm.mapped_column(LongString, nullable=False)
    visibility: orm.Mapped[Visibility_Type] = orm.mapped_column(Enum(Visibility_Type), nullable=False, server_default=sa.text(f"'{Visibility_Type.PUBLIC.value}'"))

    group_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("group.id", ondelete="CASCADE"), nullable=False)
    event_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("event.id", ondelete="CASCADE"), nullable=True)
    profile_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("profile.id", ondelete="SET NULL"), nullable=True)

discussionMedias = create_many_to_many("discussionMedias", "discussion_medias", "discussion", "media")

class Comment(Base, IdMixin):
    __tablename__ = "comment"

    content: orm.Mapped[str] = orm.mapped_column(LongString, nullable=False)

    discussion_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("discussion.id", ondelete="CASCADE"), nullable=False)
    profile_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("profile.id", ondelete="SET NULL"), nullable=True)

commentMedias = create_many_to_many("commentMedias", "comment_medias", "comment", "media")

class Reaction(Base, IdMixin):
    __tablename__ = "reaction"

    reaction: orm.Mapped[str] = orm.mapped_column(ShortString, nullable=False)

    profile_id: orm.Mapped[IDTypeT] = orm.mapped_column(sa.ForeignKey("profile.id", ondelete="SET NULL"), nullable=True)
    
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

eventMembers = create_many_to_many("eventMembers", "event_members", "event", "profile")

eventMedias = create_many_to_many("eventMedias", "event_medias", "event", "media")


class Tag(Base, IdMixin, ExtraMixin):
    __tablename__ = "tag"

    name: orm.Mapped[str] = orm.mapped_column(DefaultString, nullable=False, unique=True)

groupTags = create_many_to_many("groupTags", "group_tags", "group", "tag")

eventTags = create_many_to_many("eventTags", "event_tags", "event", "tag")

commentTags = create_many_to_many("commentTags", "comment_tags", "comment", "tag")

discussionTags = create_many_to_many("discussionTags", "discussion_tags", "discussion", "tag")

def create_extensions(engine: sa.Engine):

    with engine.connect() as conn:
        for s in extensions:
            conn.execute(sa.text(s))
        conn.commit()

def create_policies(engine: sa.Engine):

    with engine.connect() as conn:
        for p in policies:
            conn.execute(sa.text(p))
        conn.commit()

def create_functions_and_triggers(engine: sa.Engine):

    with engine.connect() as conn:
        for f in functions.keys():
            conn.execute(sa.text(functions[f]))
        conn.commit()

    with engine.connect() as conn:
        for t in triggers.keys():
            conn.execute(sa.text(triggers[t]))
        conn.commit()

def create_tables(engine: sa.Engine):
    Base.metadata.reflect(engine, schema="auth", only=["users"])

    Base.metadata.create_all(engine)

def get_engine():
    port = 8482
    pw = "your-super-secret-and-long-postgres-password"
    return sa.create_engine(f"postgresql://postgres:{pw}@127.0.0.1:{port}/postgres", echo=True)

RESET_SQL = """
DO $$
DECLARE
    table_rec RECORD;
BEGIN
    FOR table_rec IN (
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_catalog = current_database()
    ) LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || table_rec.table_name || ' CASCADE';
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

    return True

def dump_sql(metadata):

    stmts = []

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
        create_extensions(engine)
        create_tables(engine)
        create_functions_and_triggers(engine)
        create_policies(engine)


if __name__ == '__main__':
    main()