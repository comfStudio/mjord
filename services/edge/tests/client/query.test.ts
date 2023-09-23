import { it } from "std/testing/bdd";
import { testProfile } from "tests/setup";
import { clientSuite } from "tests/suite";

const suite = clientSuite;

it(suite, "anon and auth client works", async function () {
  this.expect((await this.anonClient.auth.getSession()).data?.session).toBe(null);
  this.expect((await this.client.auth.getSession()).data?.session).not.toBe(null);
});

it(suite, "not allowed to query anonymously", async function () {
  const { data, error } = await this.anonClient.from("profile").select().limit(1).single();

  this.expect(error).toBeTruthy();
  this.expect(error?.message).toContain("permission denied");
  this.expect(data).toBeFalsy();
});

it(suite, "allowed to query own profile when authenticated", async function () {
  const { data, error } = await this.client.from("profile").select().limit(10);

  //   console.log({ data, error });

  this.expect(error).toBeFalsy();
  this.expect(data).toHaveLength(1);
  this.expect(data?.[0]).toHaveProperty("name", testProfile.name);
});

it(suite, "not allowed to query anything when authenticated", async function () {
  const { data, error } = await this.client.from("group").select().limit(10);

  this.expect(data).toHaveLength(0);
  this.expect(error).toBeFalsy();
});
