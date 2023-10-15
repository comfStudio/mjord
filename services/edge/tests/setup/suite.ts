import { Client, getUserId, Req } from "common/supabase";
import { expect as jestExpect } from "https://deno.land/x/expect/mod.ts";
// @deno-types="npm:@types/chai@^4.3.6"
import { expect as chaiExpect } from "npm:chai@^4.3.8";
import { describe, TestSuite } from "std/testing/bdd";
import { getClient } from "tests/setup";
import { InvokeOptions, InvokeReturn } from "types/functions";
import { FunctionName, FunctionResponse, RequestType } from "types/schema";

import { FunctionsHttpError } from "@supabase/functions-js";

import { setupRequest, testClients } from "./index.ts";

export type UnwrapSuite<T> = T extends TestSuite<infer U> ? U : never;

type ChaiExpect = typeof chaiExpect;
type ChaiAsserttion = ReturnType<ChaiExpect>;
type JestExpect = typeof jestExpect;
type JestAssertion = ReturnType<JestExpect>;

function expect(value: any): JestAssertion & { to: ChaiAsserttion["to"] } {
  const j = jestExpect(value);
  const c = chaiExpect(value);

  const handler = {
    get(target: typeof j, prop: string, receiver: unknown) {
      if (prop === "to") {
        return c.to;
      }
      return Reflect.get(target, prop, receiver);
    },
  };

  const proxy = new Proxy(j, handler);

  return proxy as any;
}

export const suite = describe({
  name: "Global",
  async beforeAll(this: { expect: typeof expect }) {
    this.expect = expect;
  },
  async afterAll() {
    for (const client of testClients.all) {
      await client.auth.stopAutoRefresh();
    }
  },
});

export type FunctionReturn<T extends FunctionName, Opt extends InvokeOptions<T, RequestType> | undefined> =
  | {
      data: Opt extends InvokeOptions<T, RequestType> ? NonNullable<InvokeReturn<T, Opt["body"]>["data"]> : unknown;
      error: undefined;
    }
  | {
      data: undefined;
      error: Opt extends InvokeOptions<T, RequestType> ? NonNullable<InvokeReturn<T, Opt["body"]>["error"]> : never;
    };

interface InvokeFunction {
  <T extends FunctionName, Opt extends InvokeOptions<T, RequestType>>(
    name: T,
    options?: Opt
  ): Promise<FunctionReturn<T, Opt>>;
}

export interface invokeFunctions {
  invoke: InvokeFunction;
  anonInvoke: InvokeFunction;
}

async function getResponse(res: FunctionResponse) {
  const { data: d, error: e } = res;

  let error: any = d?.error;

  if (e instanceof FunctionsHttpError || (e as any)?.name === "FunctionsHttpError") {
    error = (await res.error?.context.json())?.error;
  } else if (e) {
    throw new Error(`Not implemented: ${e}`);
  }

  return {
    data: d?.data,
    error,
  };
}

/**
 * For client side testing
 */
export const clientSuite = describe({
  name: "Client",
  suite: suite,
  async beforeAll(
    this: {
      client: Client;
      anonClient: Client;
      edgeClient: Client;
      userId: string;
      _teardown: () => Promise<void>;
    } & UnwrapSuite<typeof suite> &
      invokeFunctions
  ) {
    this.client = await getClient(true);
    this.anonClient = await getClient(false);

    const [req, teardown] = await setupRequest();
    this._teardown = teardown;

    this.edgeClient = req?.client!;
    this.userId = await getUserId(this.client);
    this.invoke = (name, options) => this.client.functions.invoke(name, options).then(getResponse);
    this.anonInvoke = (name, options) => this.anonClient.functions.invoke(name, options).then(getResponse);
  },
  async afterAll() {
    this?.edgeClient?.auth?.stopAutoRefresh();
    await this._teardown();
  },
});

/**
 * For edge side testing
 */
export const edgeSuite = describe({
  name: "Edge",
  suite: suite,
  async beforeAll(
    this: {
      req: Req;
      anonReq: Req;
      anonClient: Client;
      client: Client;
      userId: string;
      _teardown: () => Promise<void>;
    } & UnwrapSuite<typeof suite> &
      invokeFunctions
  ) {
    const [req, teardown1] = await setupRequest(true);
    this.req = req;
    this.client = this.req.client;
    const [anonReq, teardown2] = await setupRequest(false);
    this.anonReq = anonReq;
    this.anonClient = this.anonReq.client;

    this._teardown = async () => {
      await teardown1();
      await teardown2();
    };
    this.userId = await getUserId(this.client);
  },
  async afterAll() {
    this.req.client.auth.stopAutoRefresh();
    await this._teardown();
  },
});
