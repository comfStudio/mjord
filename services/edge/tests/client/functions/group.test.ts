import { it } from "std/testing/bdd";
import { fetchData, fetchId } from "tests/setup/utils";

import { describeFunction } from "./index.ts";

const suite = describeFunction("group");

it(suite, "can't get nonexistent group", async function () {
  const { data, error } = await this.invoke("group", {
    body: {
      type: "get",
      id: "dfdsgdfgdfg",
    },
  });

  this.expect(error).toBeTruthy();
  this.expect(data).toBeFalsy();

  let gid = await fetchId(this.edgeClient, "group", (b) => b.eq("visibility", "public"));

  // replace single char in middle
  gid = gid.slice(0, 10) + "a" + gid.slice(10 + 1);

  const { data: data2, error: error2 } = await this.invoke("group", {
    body: {
      type: "get",
      id: gid,
    },
  });

  this.expect(error2).toBeTruthy();
  this.expect(error2?.message).toContain("not found");
  this.expect(data2).toBeFalsy();
});

it(suite, "can get existing visible group", async function () {
  const gid = await fetchId(this.edgeClient, "group", (b) => b.eq("visibility", "public"));

  this.expect(gid).toBeTruthy();

  const { data, error } = await this.invoke("group", {
    body: {
      type: "get",
      id: gid,
    },
  });

  console.log(data);
  this.expect(error).toBeFalsy();
  this.expect(data).toBeTruthy();
  this.expect(data).to.contain.keys(["id", "media", "members", "title", "visibility"]);
  this.expect(data?.media).to.contain.keys(["id", "type", "url"]);
  this.expect(data?.members?.[0]?.count).toBeTypeOf("number");
});

it(suite, "can get existing private group if member", async function () {
  const pid = (
    await fetchData(this.edgeClient, "group_members", (b) =>
      b.select(`profile_id::text, group!inner(id, visibility)`).eq("group.visibility", "private")
    )
  )?.profile_id;
  this.expect(pid).toBeTruthy();

  const gid = await fetchId(this.edgeClient, "group", (b) =>
    b
      .select(`id::text, group_members!inner(profile_id)`)
      .eq("visibility", "private")
      .eq("group_members.profile_id", pid)
  );
  this.expect(gid).toBeTruthy();

  const { data, error } = await this.invoke("group", {
    body: {
      type: "get",
      id: gid,
    },
  });

  this.expect(error).toBeFalsy();
  this.expect(data).toBeTruthy();
});

it(suite, "can't get existing private group if not member", async function () {
  const pid = (
    await fetchData(this.edgeClient, "group_members", (b) =>
      b.select(`profile_id::text, group!inner(id, visibility)`).eq("group.visibility", "private")
    )
  )?.profile_id;
  this.expect(pid).toBeTruthy();

  const gid = await fetchId(this.edgeClient, "group", (b) =>
    b
      .select(`id::text, group_members!inner(profile_id)`)
      .eq("visibility", "private")
      .neq("group_members.profile_id", pid)
  );
  this.expect(gid).toBeTruthy();

  const { data, error } = await this.invoke("group", {
    body: {
      type: "get",
      id: gid,
    },
  });

  this.expect(error).toBeFalsy();
  this.expect(data).toBeFalsy();
});

it(suite, "can get existing hidden group if is owner or admin", async function () {
  const pid = (
    await fetchData(this.edgeClient, "group_members", (b) =>
      b
        .select(`profile_id::text, group!inner(id, visibility)`)
        .eq("group.visibility", "private")
        .in("role", ["owner", "admin"])
    )
  )?.profile_id;
  this.expect(pid).toBeTruthy();

  const gid = await fetchId(this.edgeClient, "group", (b) =>
    b
      .select(`id::text, group_members!inner(profile_id)`)
      .eq("visibility", "private")
      .neq("group_members.profile_id", pid)
  );
  this.expect(gid).toBeTruthy();

  const { data, error } = await this.invoke("group", {
    body: {
      type: "get",
      id: gid,
    },
  });

  this.expect(error).toBeFalsy();
  this.expect(data).toBeTruthy();
});

it(suite, "can't get existing hidden group if is not owner or admin", async function () {
  const pid = (
    await fetchData(this.edgeClient, "group_members", (b) =>
      b
        .select(`profile_id::text, group!inner(id, visibility)`)
        .eq("group.visibility", "private")
        .neq("role", "owner")
        .neq("role", "admin")
    )
  )?.profile_id;
  this.expect(pid).toBeTruthy();

  const gid = await fetchId(this.edgeClient, "group", (b) =>
    b
      .select(`id::text, group_members!inner(profile_id)`)
      .eq("visibility", "private")
      .neq("group_members.profile_id", pid)
  );
  this.expect(gid).toBeTruthy();

  const { data, error } = await this.invoke("group", {
    body: {
      type: "get",
      id: gid,
    },
  });

  this.expect(error).toBeFalsy();
  this.expect(data).toBeFalsy();
});
