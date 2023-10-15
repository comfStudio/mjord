import { corsHeaders } from "common/cors";
import { DB } from "common/db";
import { decode } from "common/jwt";
import constant, { DatabaseRole } from "constant";
import { ConnInfo, Handler, serve as denoServe, ServeInit } from "std/server";
import {
  anyResponseData,
  functionDataOp,
  FunctionName,
  FunctionNameDataOpMap,
  RequestBody,
  requestData,
  ResponseData,
} from "types/schema";
import { ZodError } from "zod";

import setupServices from "./services/index.ts";
import { getAnonClient, getClient, getUserId, Req } from "./supabase.ts";

export async function initialize() {
  console.log("Initializing...");

  constant.db = new DB();
  constant.service = await setupServices();
  console.log("Finished initializing");
}

export async function requestInitialize(request: Request) {
  const req = request as Req;

  try {
    req.userId = await getUserId(req);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }

  if (req.headers.has("Authorization")) {
    const token = req.headers.get("Authorization")?.split(" ")?.[1] ?? "";
    if (token) {
      req.jwtData = decode(token);
      if (req?.userId) {
        req.jwtData = {
          ...req.jwtData,
          role: DatabaseRole.BackendAuthenticated,
          aud: DatabaseRole.BackendAuthenticated,
        };
      } else {
        req.jwtData = {
          ...req.jwtData,
          role: DatabaseRole.BackendAnon,
          aud: DatabaseRole.BackendAnon,
        };
      }
    }
  }

  req.client = req?.userId ? await getClient(req) : await getAnonClient(req);

  return req;
}

async function validateRequest(name: string, req: Req) {
  let data: Partial<RequestBody>;
  try {
    data = await req.json();
  } catch (_error) {
    throw new Deno.errors.InvalidData(`Invalid request body (${req?.url})`);
  }

  try {
    requestData.parse(data);

    const op = data.type;
    const key = `${name}_${op}`;
    // @ts-expect-error: .
    if (functionDataOp[key]) {
      // @ts-expect-error: .
      functionDataOp[key].parse(data);
    }
  } catch (error) {
    throw new Deno.errors.InvalidData(`Validation failed (${req?.url}): ${(error as ZodError).message}`);
  }

  return data as RequestBody;
}

export async function serve<
  N extends FunctionName,
  H extends (body: FunctionNameDataOpMap<N>, request: Req, connInfo: ConnInfo) => Promise<Resp<any>> | Resp<any>,
>(name: N, handler: H, options?: ServeInit) {
  console.log(`Loaded ${name} edge function`);
  await initialize();

  const func: Handler = async (request, connInfo) => {
    // This is needed if you're planning to invoke your function from a browser.
    if (request.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    const req = await requestInitialize(request);

    let res: Response;

    try {
      const data = (await validateRequest(name, req)) as FunctionNameDataOpMap<N>;
      res = await handler(data, req, connInfo);
    } catch (error) {
      console.debug(error);

      let status = 400;

      if (error instanceof Deno.errors.NotFound) {
        status = 404;
      } else if (error instanceof Deno.errors.InvalidData) {
        status = 422;
      }

      res = new Resp(
        {
          data: undefined,
          error: {
            message: error?.message || "Unknown error",
          },
        },
        status
      );
    }

    return res;
  };
  await denoServe(func, options);

  return undefined as any as ReturnType<H>;
}

export class Resp<T extends ResponseData<any>> extends Response {
  constructor(data: T, status?: number) {
    anyResponseData.parse(data);
    super(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: status ?? (data?.error ? 400 : 200),
    });
  }
}
