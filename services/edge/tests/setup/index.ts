import { requestInitialize } from "common/serve";
import { Client, wrapClient } from "common/supabase";
import constant from "constant";
import { load } from "https://deno.land/std@0.201.0/dotenv/mod.ts";
import * as path from "std/path";

import { createClient, SupabaseClientOptions } from "@supabase/supabase-js";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

const envs = await load({
  envPath: path.join(__dirname, "../..", ".env.test"),
  export: true,
  allowEmptyValues: true,
});

for (const key in envs) {
  if (key in constant.env) {
    // @ts-expect-error: .
    constant.env[key] = envs[key];
  }
}

console.debug("Loaded environment variables:", envs);

// Set up the configuration for the Supabase client
export const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
export const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
export const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
export const supabaseJwtSecret = Deno.env.get("SUPABASE_JWT_SECRET") ?? "";

export function getDefaultOptions(): SupabaseClientOptions<"public"> {
  const authStorage: Record<string, any> = {};
  return {
    auth: {
      autoRefreshToken: false,
      persistSession: true,
      detectSessionInUrl: true,
      storage: {
        getItem: (key) => authStorage[key],
        setItem: (key, value) => {
          authStorage[key] = value;
        },
        removeItem: (key) => {
          delete authStorage[key];
        },
      },
    },
  };
}

export const testClients = {
  user: null as Client | null,
  anon: null as Client | null,
  all: [] as Client[],
};

export const testProfile = {
  name: "Deno Test",
};

export const testUser = {
  email: "deno-test@deno-test.com",
  password: "test1234",
};

export async function getClient(user = true, options?: SupabaseClientOptions<"public">) {
  if (user && testClients.user) {
    return testClients.user;
  } else if (!user && testClients.anon) {
    return testClients.anon;
  }

  // Verify if the Supabase URL and key are provided
  if (!supabaseUrl) throw new Error("supabaseUrl is required.");
  if (!supabaseAnonKey) throw new Error("supabaseAnonKey is required.");

  options = options ?? getDefaultOptions();

  const key = supabaseAnonKey;

  const client = wrapClient(createClient(supabaseUrl, key, options));
  testClients.all.push(client);

  if (user) {
    const { error } = await client.auth.signInWithPassword(testUser);

    if (error) {
      if (!supabaseServiceRoleKey) throw new Error("supabaseServiceRoleKey is required.");
      const serviceClient = wrapClient(createClient(supabaseUrl, supabaseServiceRoleKey, options));
      testClients.all.push(serviceClient);

      const createUser = async () => {
        const { error: e, data } = await serviceClient.auth.admin.createUser({
          ...testUser,
          email_confirm: true,
        });

        return { e, userData: data?.user };
      };

      let { e, userData } = await createUser();

      if (e?.message.includes("already been registered")) {
        const { data } = await serviceClient.from("profile").select("id").eq("name", testProfile.name).single();

        if (!data?.id) {
          throw new Error("Failed to find test user to delete");
        }

        if (!(await serviceClient.auth.admin.deleteUser(data.id))) {
          throw new Error("Failed to delete test user");
        }

        const r = await createUser();
        e = r.e;
        userData = r.userData;
      }

      if (e) {
        console.error("Failed to create test user");
        throw e;
      }

      const { error: e1 } = await serviceClient
        .from("profile")
        .update(testProfile)
        .eq("id", userData?.id!);

      if (e1) {
        console.error("Failed to update test user profile");
        throw e1;
      }

      const { error: e2 } = await client.auth.signInWithPassword(testUser);
      if (e2) {
        console.error("Failed to sign in with test user");
        throw e2;
      }
    }

    testClients.user = client;
  } else {
    testClients.anon = client;
  }

  return client;
}

export const requestTestToken = {
  default: "",
};

export async function setupRequest(user = true, props?: { services?: boolean; db?: boolean }) {
  let token = requestTestToken.default;

  if (!token) {
    const client = await getClient(user, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

    const {
      data: { session },
    } = await client.auth.getSession();

    if (!session && user) {
      throw new Error("No session found");
    } else if (session) {
      token = session.access_token;
    } else {
      token = supabaseAnonKey;
    }
  }

  const req = new Request(supabaseUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  constant.env.SUPABASE_URL = supabaseUrl;
  constant.env.SUPABASE_ANON_KEY = supabaseAnonKey;
  constant.env.SUPABASE_SERVICE_ROLE_KEY = supabaseServiceRoleKey;

  return [
    await requestInitialize(req),
    async () => {
      if (props?.services) {
      }

      if (props?.db) {
        await constant.db.close();
        constant.db = undefined as any;
      }
    },
  ] as const;
}
