import { it } from 'std/testing/bdd';

import { describeFunction } from './index.ts';

const suite = describeFunction("profile");

it(suite, "errs at invalid body", async function () {
  // @ts-expect-error: .
  const { data, error } = await this.invoke("profile", {});

  this.expect(error).toBeTruthy();
  this.expect(error?.message).toContain("Invalid");
  this.expect(data).toBeFalsy();
});

it(suite, "validates", async function () {
  const { data, error } = await this.invoke("profile", {
    body: {
      // @ts-expect-error: .
      test: "test",
    },
  });

  this.expect(error).toBeTruthy();
  this.expect(error?.message).toContain("Validation");
  this.expect(data).toBeFalsy();
});
