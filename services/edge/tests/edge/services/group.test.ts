import GroupService from "common/services/group";
import { it } from "std/testing/bdd";
import { fetchId } from "tests/setup/utils";

import { describeService } from "./index.ts";

const suite = describeService(GroupService);

it(suite, "getGroup", async function () {
  const gid = await fetchId(this.client, "group", (b) => b.eq("visibility", "public"));

  const data = await this.service.getGroup(this.req.client, gid);
  this.expect(data).toBeTruthy();
  this.expect(data?.id).toEqual(gid);
});
