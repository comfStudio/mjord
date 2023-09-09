import { Req } from "common/serve";
import { beforeAll, describe, TestSuite } from "std/testing/bdd";

import { setupRequest, testClients } from "./index.ts";

export type UnwrapSuite<T> = T extends TestSuite<infer U> ? U : never;

export const suite = describe({
  name: "Global",
  async beforeAll() {},
  async afterAll() {
    for (const client of testClients.all) {
      await client.auth.stopAutoRefresh();
    }
  },
});

export const clientSuite = describe({
  name: "Client",
  suite: suite,
  async beforeAll(this: UnwrapSuite<typeof suite>) {},
  async afterAll() {},
});

export const edgeSuite = describe({
  name: "Edge",
  suite: suite,
  async beforeAll(this: { req: Req } & UnwrapSuite<typeof suite>) {
    this.req = await setupRequest();
  },
  afterAll: async () => {},
});
