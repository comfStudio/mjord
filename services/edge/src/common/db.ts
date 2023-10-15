import { Req } from "common/supabase";
import constant from "constant";
import postgres from "postgresjs";

export class DB<DBTypes extends Record<string, postgres.PostgresType<unknown>> = {}> {
  _sql: postgres.Sql<DBTypes>;

  constructor() {
    this._sql = postgres(constant.env.SUPABASE_DB_URL, {
      connection: {
        application_name: "mjord",
      },
      max: constant.DB_POOL_LIMIT,
      max_lifetime: constant.DB_MAX_LIFETIME,
      idle_timeout: constant.DB_IDLE_TIMEOUT,
    }) as postgres.Sql<DBTypes>;
  }

  private contextSql(req: Req, sql: postgres.Sql<DBTypes>) {
    const claim = {
      ...req.jwtData,
    };

    const s = sql.unsafe(`
      SELECT set_config('request.jwt.claims', '${JSON.stringify(claim)}', true);
      SET LOCAL ROLE ${claim.role ?? "anon"};
    `);

    return s;
  }

  sql(req: Req) {
    return <T extends readonly (object | undefined)[] = postgres.Row[]>(
      template: TemplateStringsArray,
      ...parameters: readonly postgres.ParameterOrFragment<DBTypes[keyof DBTypes]>[]
    ): postgres.PendingQuery<T> => {
      return this._sql.begin<T>(async (sql) => {
        await this.contextSql(req, sql);
        return await sql<T>(template, ...parameters);
      }) as any as postgres.PendingQuery<T>;
    };
  }

  transaction(ctx: (db: DB) => Promise<void>) {}

  async close() {
    await this._sql.end();
  }
}

export class Transaction<T extends DB> {
  db: T;

  constructor(db: T) {
    this.db = db;
  }
}
