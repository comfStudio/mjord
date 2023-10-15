import { DB } from "common/db";
import { describe, it } from "std/testing/bdd";
import { edgeSuite, UnwrapSuite } from "tests/suite";

/**
 * For edge side testing
 */
export const suite = describe({
  name: "DB",
  suite: edgeSuite,
  beforeEach(this: { db: DB } & UnwrapSuite<typeof edgeSuite>) {
    this.db = new DB();
  },
  async afterEach() {
    await this.db.close();
  },
});

it(suite, "can query", async function () {
  const r = await this.db.sql(this.req)`
        select * from
          (select version()) as version,
          (select current_setting('server_version_num')) as version_number;
        `;

  this.expect(r?.[0]).toBeTruthy();
  this.expect(r?.[0]).to.contain.keys("version", "current_setting");
  this.expect(r?.[0].version).toBeTruthy();
  this.expect(r?.[0].current_setting).toBeTruthy();
});

it(suite, "can query data with anon backend role", async function () {
  const r = await this.db.sql(this.anonReq)`
        select * from public.profile limit 1;
        `;

  this.expect(r?.[0]).toBeTruthy();
  this.expect(r?.[0]).to.contain.keys("id", "name");
});

it(suite, "can query data with authenticated backend role", async function () {
  const r = await this.db.sql(this.req)`
        select * from public.group limit 10;
        `;

  this.expect(r).to.be.have.length.greaterThan(2);
});

it(suite, "cannot query data with anon client role", async function () {
  const req: any = {
    jwtData: {
      ...this.anonReq.jwtData,
      role: "anon",
      aud: "anon",
    },
  };

  const [jwt] = await this.db.sql(req)`
          select auth.jwt()
          `;
  this.expect(jwt).toBeTruthy();
  this.expect(jwt?.jwt?.role).to.eq("anon");
  this.expect(jwt?.jwt?.aud).to.eq("anon");

  let err = null;

  try {
    await this.db.sql(req)`
            select * from public.profile limit 1;
            `;
  } catch (e) {
    err = e;
  }

  this.expect(err).toBeTruthy();
  this.expect(err?.message).toContain("permission denied");
});

it(suite, "cannot query data with authenticated client role", async function () {
  const req: any = {
    jwtData: {
      ...this.req.jwtData,
      role: "authenticated",
      aud: "authenticated",
    },
  };

  const [jwt] = await this.db.sql(req)`
  select auth.jwt()
  `;
  this.expect(jwt).toBeTruthy();
  this.expect(jwt?.jwt?.role).to.eq("authenticated");
  this.expect(jwt?.jwt?.aud).to.eq("authenticated");

  const r = await this.db.sql(req)`
          select * from public.group limit 0;
          `;

  this.expect(r).toHaveLength(0);
});
