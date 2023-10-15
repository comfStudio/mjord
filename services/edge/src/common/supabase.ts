import { decode, encode, SupabaseJWTToken } from "common/jwt";
import constant, { DatabaseRole } from "constant";
import { Database, FilterQuery, SchemaName } from "types/db";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface Req extends Request {
  client: Client;
  jwtData: SupabaseJWTToken
  userId?: string;
}

async function getKeyClient(key: string, req: Req): Promise<Client> {
  const headers = {} as Record<string, string>;

  let token = "";
  if (req.headers.has("Authorization")) {
    const req_token = req.headers.get("Authorization")?.split(" ")?.[1] ?? "";
    if (req_token) {
      const req_jwt = req.jwtData

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

  return wrapClient(supabaseClient);
}

export async function getClient(req: Req) {
  return await getKeyClient(constant.env.SUPABASE_SERVICE_ROLE_KEY, req);
}

export async function getAnonClient(req: Req) {
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

export function wrapClient(client: SupabaseClient<Database>) {
  const wrapper = new ClientWrapper(client);

  return new Proxy(client, {
    get(_target, prop) {
      if (prop in wrapper) {
        return Reflect.get(wrapper, prop);
      }

      // @ts-expect-error: .
      return Reflect.get(...arguments);
    },
  }) as Client;
}

export function wrapQueryBuilder<T extends FilterQuery<any>>(builder: T) {
  type Return = QueryWrapper<T>;

  const builderWrapper: any = new FilterQueryWrapper(
    builder,
    new Proxy(builder, {
      get(target: any, prop) {
        if (prop in builderWrapper) {
          return Reflect.get(builderWrapper, prop);
        }

        if (typeof prop === "string" && ["or", "eq"].includes(prop)) {
          const h = target[prop];
          return function (...args: any[]) {
            const r = h.apply(builder, args);
            return wrapQueryBuilder(r);
          };
        }

        return Reflect.get(builder, prop);
      },
    })
  );
  return builderWrapper.proxy as Return;
}

class FilterQueryWrapper<T extends FilterQuery<any>, Return = QueryWrapper<T>> {
  constructor(
    private builder: T,
    private proxy: Return
  ) {}

  addSelect<Schema extends SchemaName, Table extends keyof Database[Schema]>(columns: string) {
    let quoted = false;
    const cleanedColumns = columns
      .split("")
      .map((c) => {
        if (/\s/.test(c) && !quoted) {
          return "";
        }
        if (c === '"') {
          quoted = !quoted;
        }
        return c;
      })
      .join("");

    // @ts-expect-error: .
    const s = this.builder.url.searchParams.get("select") ?? "";
    // @ts-expect-error: .
    this.builder.url.searchParams.set("select", `${s}${s ? "," : ""}${cleanedColumns}`);
    return this.proxy as Return;
  }
}
export interface QueryWrapper<F extends FilterQuery<any>>
  extends FilterQuery<F extends FilterQuery<infer R> ? R : any>,
    FilterQueryWrapper<F> {}

class ClientWrapper {
  constructor(private client: SupabaseClient<Database>) {}
}

export interface Client extends SupabaseClient<Database>, ClientWrapper {}
