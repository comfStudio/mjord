import { beforeAll, describe, TestSuite } from "std/testing/bdd";
import { edgeSuite, UnwrapSuite } from "tests/suite";

import { Service, ServiceLocator } from "../../src/common/services/base.ts";

export const serviceSuite = describe({
  name: "Service",
  suite: edgeSuite,
  async beforeAll() {},
  afterAll: async () => {},
});

type ThisService<T> = { service: T } & UnwrapSuite<typeof serviceSuite>;

export function describeService<T extends Service>(service: {
  new (): T;
}): TestSuite<ThisService<T>> {
  return describe({
    suite: serviceSuite,
    name: service.constructor.name,
    async beforeEach(this: ThisService<T>) {
      this.service = new service();
      const locator = new ServiceLocator();
      locator.set(this.service);

      await this.service.init(locator);
      this.service.locator = locator;
    },
  });
}
