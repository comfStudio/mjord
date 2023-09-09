import constant from "constant";
import { Database } from "types/db";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type Client = SupabaseClient<Database>;

function getKeyClient(key: string, req: Request): Client {
  // Create a Supabase client with the Auth context of the logged in user.
  const supabaseClient = createClient(constant.env.SUPABASE_URL, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    // Create client with Auth context of the user that called the function.
    global: {
      headers: { Authorization: req.headers.get("Authorization")! },
    },
  });

  return supabaseClient;
}

export function getClient(req: Request) {
  return getKeyClient(constant.env.SUPABASE_SERVICE_ROLE_KEY, req);
}

export function getAnonClient(req: Request) {
  return getKeyClient(constant.env.SUPABASE_ANON_KEY, req);
}

export async function getUser(req: Request | Client) {
  const c = req instanceof SupabaseClient ? req : getClient(req);
  return (await c.auth.getUser())?.data?.user;
}

export async function getAnonUser(req: Request | Client) {
  const c = req instanceof SupabaseClient ? req : getAnonClient(req);
  return (await c.auth.getUser())?.data?.user;
}

export async function getUserId(req: Request | Client) {
  const user = await getUser(req);
  if (!user) {
    throw new Deno.errors.NotFound("User not found");
  }
  return user.id;
}
