import UserService from "common/services/user";
import { assertEquals } from "std/assert";
import { it } from "std/testing/bdd";
import { testProfile } from "tests/common";

import { describeService } from "./index.ts";

const suite = describeService(UserService);

it(suite, "getProfile", async function () {
  const data = await this.service.getProfile(this.req.client);
  assertEquals(data.name, testProfile.name);
});
