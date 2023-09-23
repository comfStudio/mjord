import { decode, encode } from "common/jwt";
import constant, { DatabaseRole } from "constant";
import { Database } from "types/db";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type Client = SupabaseClient<Database>;

export interface Req extends Request {
  client: Client;
  userId?: string;
}

async function getKeyClient(key: string, req: Request): Promise<Client> {
  const headers = {} as Record<string, string>;

  let token = "";
  if (req.headers.has("Authorization")) {
    const req_token = req.headers.get("Authorization")?.split(" ")?.[1] ?? "";
    if (req_token) {
      const req_jwt = decode(req_token);

      // convert to backend role
      if (req_jwt && key === constant.env.SUPABASE_ANON_KEY) {
        token = await encode({
          ...req_jwt,
          role: DatabaseRole.BackendAnon,
          aud: DatabaseRole.BackendAnon,
        });
      } else if (req_jwt && key === constant.env.SUPABASE_SERVICE_ROLE_KEY) {
        token = await encode({
          ...req_jwt,
          role: DatabaseRole.BackendAuthenticated,
          aud: DatabaseRole.BackendAuthenticated,
        });
      } else {
        token = req_token;
      }
    }
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Create a Supabase client with the Auth context of the logged in user.
  const supabaseClient = createClient(constant.env.SUPABASE_URL, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    // Create client with Auth context of the user that called the function.
    global: {
      headers,
    },
  });

  return supabaseClient;
}

export async function getClient(req: Request) {
  return await getKeyClient(constant.env.SUPABASE_SERVICE_ROLE_KEY, req);
}

export async function getAnonClient(req: Request) {
  return await getKeyClient(constant.env.SUPABASE_ANON_KEY, req);
}

export async function getUserId(req: Req | Client) {
  let userId: string | undefined;
  if (req instanceof SupabaseClient) {
    const client = req;

    // @ts-expect-error: .
    const token = client.headers?.["Authorization"]?.split(" ")?.[1] ?? "";
    if (token) {
      const jwt = decode(token);
      if (jwt?.sub) {
        userId = jwt.sub;
      }
    } else {
      // get from session
      const {
        data: { session },
      } = await client.auth.getSession();
      if (session) {
        userId = session.user?.id;
      }
    }
  } else {
    if (req?.userId) {
      userId = req.userId;
    } else if (req.headers.has("Authorization")) {
      const token = req.headers.get("Authorization")?.split(" ")?.[1] ?? "";
      if (token) {
        const jwt = decode(token);
        if (jwt?.sub) {
          userId = jwt.sub;
        }
      }
    }
  }

  if (!userId) {
    throw new Deno.errors.NotFound("User not found");
  }
  return userId;
}

// export async function getAnonUser(req: Req | Client) {
//   const c = req instanceof SupabaseClient ? req : req.client;
//   return (await c.auth.getUser())?.data?.user;
// }
