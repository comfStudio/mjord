import { corsHeaders } from 'common/cors';
import constant from 'constant';
import { ConnInfo, Handler, serve as denoServe, ServeInit } from 'std/server';
import { FunctionName } from 'types/functions';
import {
  anyResponseData,
  functionDataOp,
  FunctionDataOp,
  RequestBody,
  requestData,
  ResponseData,
} from 'types/schema';
import { ZodError } from 'zod';

import setupServices from './services/index.ts';
import { Client, getClient } from './supabase.ts';

export async function initialize() {
  console.log("Initializing...");

  constant.service = await setupServices();
  console.log("Finished initializing");
}

export interface Req extends Request {
  client: Client;
}

export async function requestInitialize(request: Request) {
  const req = request as Req;
  req.client = getClient(request);
  return req;
}

async function validateRequest(name: string, req: Req) {
  let data: Partial<RequestBody>;
  try {
    data = await req.json();
  } catch (error) {
    throw new Deno.errors.InvalidData("Invalid request body");
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
    throw new Deno.errors.InvalidData(
      `Validation failed: ${(error as ZodError).message}`
    );
  }

  return data as RequestBody;
}

export async function serve<
  N extends FunctionName,
  H extends (
    body: RequestBody,
    request: Req,
    connInfo: ConnInfo
  ) => Promise<Resp<any>> | Resp<any>
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
      const data = await validateRequest(name, req);
      res = await handler(data as FunctionDataOp<>, req, connInfo);
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
