import { it } from "std/testing/bdd";

import { describeFunction } from "./index.ts";

const suite = describeFunction("featured");

it(suite, "get group", async function () {
  const { data, error } = await this.invoke("featured", {
    body: {
      type: "get",
      entity: "group",
    },
  });

  this.expect(error).toBeFalsy();
  this.expect(data?.length).to.be.greaterThan(3);

  this.expect(data?.[0]).to.contain.keys(["id", "media", "members", "title", "visibility"]);
  this.expect(data?.[0].media).to.contain.keys(["id", "type", "url"]);
  this.expect(data?.[0].members?.[0]?.count).toBeTypeOf("number");
});

it(suite, "get event", async function () {
  const { data, error } = await this.invoke("featured", {
    body: {
      type: "get",
      entity: "event",
    },
  });

  this.expect(error).toBeFalsy();
  // @ts-expect-error: .
  this.expect(data?.length).to.be.greaterThan(3);
});
