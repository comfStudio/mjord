import { beforeAll, describe, TestSuite } from "std/testing/bdd";
import { clientSuite, UnwrapSuite } from "tests/suite";

export const functionSuite = describe({
  name: "Functions",
  suite: clientSuite,
  async beforeAll() {},
  afterAll: async () => {},
});

type ThisFunction<T> = T & UnwrapSuite<typeof functionSuite>;

export function describeFunction<T = {}>(
  name: string
): TestSuite<ThisFunction<T>> {
  return describe({
    suite: functionSuite,
    name,
    async beforeEach(this: ThisFunction<T>) {},
  });
}
