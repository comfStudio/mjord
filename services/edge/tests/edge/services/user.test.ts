import UserService from "common/services/user";
import { it } from "std/testing/bdd";
import { testProfile } from "tests/setup";

import { describeService } from "./index.ts";

const suite = describeService(UserService);

it(suite, "getProfile", async function () {
  const data = await this.service.getProfile(this.req.client);
  this.expect(data.name).toEqual(testProfile.name);
  this.expect(data.description).toBeDefined();
  this.expect(data.modified_at).toBeDefined();
});
