import type { ServiceLocator } from "./services/base.ts";


export enum ServiceType {
  Database,
  User,
  Group,
  //   Event,
  // Character,
  // Template,
  // Tag,
}

export default class constant {
  static env = {
    SUPABASE_URL: Deno.env.get("SUPABASE_URL") ?? "",
    SUPABASE_ANON_KEY: Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    SUPABASE_DB_URL: Deno.env.get("SUPABASE_DB_URL") ?? "",
  };

  static service: ServiceLocator;
}
