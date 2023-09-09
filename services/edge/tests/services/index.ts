import { beforeAll, describe, TestSuite } from "std/testing/bdd";
import { edgeSuite, UnwrapSuite } from "tests/suite";

import { Service, ServiceLocator } from "../../src/common/services/base.ts";

export const servicSuite = describe({
  name: "Service",
  suite: edgeSuite,
  async beforeAll() {},
  afterAll: async () => {},
});

type ThisService<T> = { service: T } & UnwrapSuite<typeof servicSuite>;

export function describeService<T extends Service>(service: {
  new (): T;
}): TestSuite<ThisService<T>> {
  return describe({
    suite: servicSuite,
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
