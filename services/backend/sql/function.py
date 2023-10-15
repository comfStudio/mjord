import functools
import os
import importlib
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from . import sql


func_sql = {}

schema = "public"
dialect = postgresql.dialect()

def render(statement):
  s = statement.compile(dialect=dialect, compile_kwargs={"literal_binds": True})
  return str(s) + ';'


def define_function(name, args, body, declare, returns, language):
  dcl = "\nDECLARE\n" + declare if declare else ""
  return f"""
    CREATE OR REPLACE FUNCTION {name}({",".join(args)})
    RETURNS {returns}
    LANGUAGE {language}

    AS $${dcl}
    {"BEGIN" if language != "SQL" else ""}
      {body}
    {"END;" if language != "SQL" else ""}
    $$;
  """

def define_sql_function(name: str, args: list[str], body:str, returns:str = "SETOF RECORD"):
  return define_function(name, args, body, declare="", returns = returns, language = "SQL")

def define_plpgsql_function(name:str, args: list[str], body: str, returns: str = "void", declare: str=""):
  return define_function(name, args, body, declare=declare, returns = returns, language = "plpgsql")

def func(f):
  fname = f"{schema}.{f.__name__}"
  func_sql[fname] = f

  @functools.wraps(f)
  def wrapper(*a, **kw):
    s = f(*a, **kw)
    assert isinstance(s, str)
    return s

  return wrapper


def load(path = "sql/functions"):
  func_sql.clear()
  file_list = os.listdir(path)
  package = path.replace('/','.').replace('\\','.')
    # Iterate through the files and import modules
  for file in file_list:
    if file.endswith('.py') and not file.startswith('__init__'):
      module_name = file[:-3]  # Remove the '.py' extension
      module_name = module_name.replace('-', '_')  # Replace hyphens with underscores if needed
      module_name = module_name.replace(' ', '_')  # Replace spaces with underscores if needed

      importlib.import_module(f"{package}.{module_name}")


FUNC_CACHE = []

def create_functions(engine: sa.Engine):
  with engine.connect() as conn:
    for f, sql_func in func_sql.items():
      sql_text = sql_func(f)
      conn.execute(sa.text(sql_text))


      for r in sql.FUNC_ROLES:
        conn.execute(sa.text(f'GRANT EXECUTE ON FUNCTION {f} TO "{r}";'))


      for r in sql.REVOKE_FUNC_ROLES:
        conn.execute(sa.text(f'REVOKE EXECUTE ON FUNCTION {f} FROM "{r}";'))

      conn.commit()

  return True

def reset_db(engine: sa.Engine):
  func_names = list(FUNC_CACHE)
  if not func_names:
    func_names = list(func_sql.keys())

  # functions (will cascade to triggers)

  if func_names:
    with engine.connect() as conn:
      for f in FUNC_CACHE:
          conn.execute(sa.text(f"DROP FUNCTION IF EXISTS {f} CASCADE;"))
      conn.commit()

  return True

func_cache_path = "sql/.funcs.cache"

def main():
  if os.path.exists(func_cache_path):
    with open(func_cache_path, "r") as f:
      FUNC_CACHE.clear()
      FUNC_CACHE.extend([x.strip() for x in f.readlines()])

  engine = sql.get_engine()
  reset_db(engine)

  load()
  FUNC_CACHE.clear()
  FUNC_CACHE.extend(func_sql.keys())

  with open(func_cache_path, "w") as f:
    f.write("\n".join(FUNC_CACHE))

  create_functions(engine)

if __name__ == '__main__':
  main()
