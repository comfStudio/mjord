import { Client, Req } from "common/supabase";
import { expect } from "https://deno.land/x/expect/mod.ts";
import { describe, TestSuite } from "std/testing/bdd";
import { getClient } from "tests/setup";
import { InvokeOptions, InvokeReturn } from "types/functions";
import { FunctionName, FunctionResponse, RequestType } from "types/schema";

import { FunctionsHttpError } from "@supabase/functions-js";

import { setupRequest, testClients } from "./index.ts";

export type UnwrapSuite<T> = T extends TestSuite<infer U> ? U : never;

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

export type FunctionReturn<
  T extends FunctionName,
  Opt extends InvokeOptions<T, RequestType> | undefined
> =
  | {
      data: Opt extends InvokeOptions<T, any>
        ? NonNullable<InvokeReturn<T, Opt["body"]>["data"]>
        : unknown;
      error: undefined;
    }
  | {
      data: undefined;
      error: Opt extends InvokeOptions<T, any>
        ? NonNullable<InvokeReturn<T, Opt["body"]>["error"]>
        : never;
    };

interface InvokeFunction {
  <T extends FunctionName, Opt extends InvokeOptions<T, RequestType> = any>(
    name: T,
    options?: Opt
  ): Promise<FunctionReturn<T, Opt>>;
}

export interface invokeFunctions<> {
  invoke: InvokeFunction;
  anonInvoke: InvokeFunction;
}

async function getResponse(res: FunctionResponse) {
  const { data: d, error: e } = res;

  let error: any = d?.error;

  if (e instanceof FunctionsHttpError) {
    error = (await res.error?.context.json())?.error;
  } else if (e) {
    throw new Error("Not implemented");
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
    } & UnwrapSuite<typeof suite> &
      invokeFunctions
  ) {
    this.anonClient = await getClient(false);
    this.anonClient = await getClient(false);
    this.client = await getClient(true);
    this.invoke = (name, options) =>
      this.client.functions.invoke(name, options).then(getResponse);
    this.anonInvoke = (name, options) =>
      this.anonClient.functions.invoke(name, options).then(getResponse);
  },
  async afterAll() {},
});

/**
 * For edge side testing
 */
export const edgeSuite = describe({
  name: "Edge",
  suite: suite,
  async beforeAll(
    this: { req: Req; client: Client } & UnwrapSuite<typeof suite> &
      invokeFunctions
  ) {
    this.req = await setupRequest();
    this.client = this.req.client;
  },
  afterAll: async () => {},
});
