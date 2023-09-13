import { Req } from 'common/serve';
import { Client } from 'common/supabase';
import { expect } from 'https://deno.land/x/expect/mod.ts';
import { beforeAll, describe, TestSuite } from 'std/testing/bdd';
import { getClient } from 'tests/common';
import { FunctionResponse, RequestBody, ResponseData } from 'types';

import {
  FunctionInvokeOptions,
  FunctionsHttpError,
} from '@supabase/functions-js';

import { setupRequest, testClients } from './index.ts';

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

export interface InvokeOptions extends FunctionInvokeOptions {
  body: RequestBody;
}

type Invoke = (
  name: string,
  options?: InvokeOptions
) => Promise<ResponseData<any>>;

async function getResponse<T>(res: FunctionResponse): Promise<ResponseData<T>> {
  if (res.error && res.error instanceof FunctionsHttpError) {
    return {
      data: res.data ?? undefined,
      error: (await res.error?.context.json())?.error,
    };
  }
  return {
    data: res.data ?? undefined,
    error: res.error ?? undefined,
  };
}

export const clientSuite = describe({
  name: "Client",
  suite: suite,
  async beforeAll(
    this: {
      client: Client;
      guestClient: Client;
      invoke: Invoke;
      guestInvoke: Invoke;
    } & UnwrapSuite<typeof suite>
  ) {
    this.client = await getClient(true);
    this.guestClient = await getClient(false);
    this.invoke = (name, options) =>
      this.client.functions.invoke(name, options).then(getResponse);
    this.guestInvoke = (name, options) =>
      this.guestClient.functions.invoke(name, options).then(getResponse);
  },
  async afterAll() {},
});

export const edgeSuite = describe({
  name: "Edge",
  suite: suite,
  async beforeAll(
    this: { req: Req; client: Client } & UnwrapSuite<typeof suite>
  ) {
    this.req = await setupRequest();
    this.client = await getClient(true);
  },
  afterAll: async () => {},
});
