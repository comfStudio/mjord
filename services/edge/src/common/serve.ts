import { corsHeaders } from "common/cors";
import constant from "constant";
import { ConnInfo, Handler, serve as denoServe, ServeInit } from "std/server";

import setupServices from "./services/index.ts";
import { Client, getClient } from "./supabase.ts";

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

export async function serve(
  name: string,
  handler: (request: Req, connInfo: ConnInfo) => Promise<Response> | Response,
  options?: ServeInit
) {
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
      res = await handler(req, connInfo);
    } catch (error) {
      res = new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    return res;
  };

  //@ts-expect-error: .
  func.name = name;

  return denoServe(func, options);
}

export class Resp<T> extends Response {
  constructor(public data: T | null, public error?: never, status?: number) {
    super(JSON.stringify({ data, error }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: status ?? (error ? 400 : 200),
    });
  }
}
