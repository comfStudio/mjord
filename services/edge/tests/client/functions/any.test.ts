import { it } from "std/testing/bdd";

import { describeFunction } from "./index.ts";

const profileSuite = describeFunction("profile");

it(profileSuite, "errs at invalid body", async function () {
  const { data, error } = await this.invoke("profile", {} as any);

  this.expect(error).toBeTruthy();
  this.expect(error?.message).toContain("Invalid");
  this.expect(data).toBeFalsy();
});

it(profileSuite, "validates", async function () {
  const { data, error } = await this.invoke("profile", {
    body: {
      test: "test",
    },
  });

  this.expect(error).toBeTruthy();
  this.expect(error?.message).toContain("Validation");
  this.expect(data).toBeFalsy();
});
