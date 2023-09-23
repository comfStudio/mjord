import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";

console.log("main function started");

const JWT_SECRET = Deno.env.get("JWT_SECRET");
const VERIFY_JWT = Deno.env.get("VERIFY_JWT") === "true";
const IMPORT_MAP = Deno.env.get("IMPORT_MAP");
const LOCAL_DEV = Deno.env.get("LOCAL_DEV") === "true";

const FUNCTIONS_DIR = `/home/deno/functions`;

function getAuthToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    throw new Error("Missing authorization header");
  }
  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer") {
    throw new Error(`Auth header is not 'Bearer {token}'`);
  }
  return token;
}

async function verifyJWT(jwt: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(JWT_SECRET);
  try {
    await jose.jwtVerify(jwt, secretKey);
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
}

serve(async (req: Request) => {
  const url = new URL(req.url);
  const { pathname } = url;

  // handle health checks
  if (pathname === "/_internal/health") {
    return new Response(JSON.stringify({ message: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method !== "OPTIONS" && VERIFY_JWT) {
    try {
      const token = getAuthToken(req);
      const isValidJWT = await verifyJWT(token);

      if (!isValidJWT) {
        return new Response(JSON.stringify({ msg: "Invalid JWT" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (e) {
      console.error(e);
      return new Response(JSON.stringify({ msg: e.toString() }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const path_parts = pathname.split("/");
  const service_name = path_parts[1];

  if (!service_name || service_name === "") {
    const error = { msg: "missing function name in request" };
    return new Response(JSON.stringify(error), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const servicePath = `${FUNCTIONS_DIR}/${service_name}`;
  console.error(`serving the request with ${servicePath}`);

  const memoryLimitMb = 150;
  const workerTimeoutMs = LOCAL_DEV ? 5 * 60 * 1000 : 1 * 60 * 1000;
  const noModuleCache = LOCAL_DEV;
  const importMapPath = IMPORT_MAP || null;
  const envVarsObj = Deno.env.toObject();
  const envVars = Object.keys(envVarsObj).map((k) => [k, envVarsObj[k]]);

  let opts = {};

  // local dev
  if (LOCAL_DEV) {
    opts = {
      ...opts,
      forceCreate: true,
      customModuleRoot: "", // empty string to allow any local path
      cpuTimeThresholdMs: 50,
      cpuBurstIntervalMs: 100,
      maxCpuBursts: 100,
    };
  }

  try {
    // @ts-expect-error: .
    const worker = await EdgeRuntime.userWorkers.create({
      servicePath,
      memoryLimitMb,
      workerTimeoutMs,
      noModuleCache,
      importMapPath,
      envVars,
      ...opts,
    });
    return await worker.fetch(req);
  } catch (e) {
    const error = { msg: e.toString() };
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
