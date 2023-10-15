import type { ServiceLocator } from "./services/base.ts";
import type { DB } from "./db.ts";

export enum ServiceType {
  Database,
  User,
  Group,
  //   Event,
  // Character,
  // Template,
  // Tag,
}

export enum DatabaseRole {
  BackendAnon = "backend_anon",
  BackendAuthenticated = "backend_authenticated",
}
export default class constant {
  static JWT_ENCODED_CACHE_LIMIT = 10000;
  static JWT_ISSUER = "mjord";
  static JWT_ALGORITHM = "HS256";
  static JWT_EXPIRES_IN = "3h";

  static DB_POOL_LIMIT = 10;
  static DB_IDLE_TIMEOUT = 20; // seconds
  static DB_MAX_LIFETIME = 60 * 10; // seconds

  static DEFAULT_BACKEND_AUD = DatabaseRole.BackendAnon;
  static DEFAULT_BACKEND_ROLE = DatabaseRole.BackendAnon;

  static env = {
    JWT_SECRET: Deno.env.get("JWT_SECRET") ?? "",
    SUPABASE_URL: Deno.env.get("SUPABASE_URL") ?? "",
    SUPABASE_ANON_KEY: Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    SUPABASE_DB_URL: Deno.env.get("SUPABASE_DB_URL") ?? "",
    LOCAL_DEV: Deno.env.get("LOCAL_DEV") === "true",
  };

  static service: ServiceLocator;
  static db: DB;
}
