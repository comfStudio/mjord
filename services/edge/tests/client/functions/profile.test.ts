import { itAnonAuth } from "tests/setup/utils";

import { describeFunction } from "./index.ts";

const suite = describeFunction("profile");

itAnonAuth(suite, "get", async function () {
  const { data, error } = await this.invoke("profile", {
    body: {
      type: "get",
    },
  });

  if (this.testType === "auth") {
    this.expect(error).toBeFalsy();
    this.expect(data).toBeTruthy();
    this.expect(data).to.contain.keys(["name", "description", "modified_at"]);
  } else {
    this.expect(data?.name).toBeFalsy();
    this.expect(error).toBeTruthy();
    this.expect(error?.message).toContain("not found");
  }
});
