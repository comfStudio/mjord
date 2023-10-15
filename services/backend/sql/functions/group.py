from sql import sql
from sql.function import func, render, define_sql_function
import sqlalchemy as sa

auth_uid = sa.text("auth.uid()")

@func
def get_group(name):
    return define_sql_function(
        name,
        args=["rowid text"],
        body=render(
            sa.select(sql.Group, (sa.alias(sa.select(sql.Media).where(sql.Group.media_id == sql.Media.id), "media")))
            .join(sql.groupMembers)
            .where(
                sa.and_(
                    sql.Group.id == sa.text("rowid"),
                    sa.or_(
                      # allow public
                      sql.Group.visibility == sql.Visibility_Type.PUBLIC,
                      # allow private if member
                      sql.groupMembers.profile_id == auth_uid
                    )
                    )
                )
        ),
        returns=f"SETOF RECORD",
    )



