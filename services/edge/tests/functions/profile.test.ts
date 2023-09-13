import { it } from 'std/testing/bdd';

import { describeFunction } from './index.ts';

const suite = describeFunction("profile");

it(suite, "get", async function () {
  const { data, error } = await this.invoke("profile", {
    body: {
      type: "get",
    },
  });

  this.expect(data).toBeTruthy();
  this.expect(error).toBeFalsy();
  this.expect(data?.data?.name).toBeTruthy();
});
