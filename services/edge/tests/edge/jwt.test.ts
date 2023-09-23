import * as jwt from "common/jwt";
import { DatabaseRole } from "constant";
import { describe, it } from "std/testing/bdd";
import { edgeSuite } from "tests/suite";

const suite = describe({
  name: "JWT",
  suite: edgeSuite,
});

it(suite, "encoding and decoding", async function () {
  const data = await jwt.encode({ name: "test" });
  this.expect(data).toBeTruthy();
  this.expect(typeof data).toEqual("string");

  const decoded = jwt.decode(data);
  this.expect(decoded).toBeTruthy();
  this.expect(decoded).toHaveProperty("name", "test");
  this.expect(decoded).toHaveProperty("aud");
  this.expect(decoded).toHaveProperty("role");
  this.expect(decoded).toHaveProperty("iss");
  this.expect(decoded).toHaveProperty("iat");
  this.expect(decoded).toHaveProperty("exp");
  this.expect(decoded.aud).toEqual(DatabaseRole.BackendAnon);
  this.expect(decoded.role).toEqual(DatabaseRole.BackendAnon);
  this.expect(decoded?.role).not.toEqual(DatabaseRole.BackendAuthenticated);
});

it(suite, "encoding overrides some props", async function () {
  const d = {
    name: "test",
    exp: 0,
    iat: 0,
    iss: "test",
    aud: "test",
    role: "test",
  };
  const data = await jwt.encode(d);
  this.expect(data).toBeTruthy();

  const decoded = jwt.decode(data);
  this.expect(decoded).toHaveProperty("aud", d.aud);
  this.expect(decoded).toHaveProperty("role", d.role);
  this.expect(decoded).not.toHaveProperty("iss", d.iss);
  this.expect(decoded).not.toHaveProperty("iat", d.iat);
  this.expect(decoded).not.toHaveProperty("exp", d.exp);
});
