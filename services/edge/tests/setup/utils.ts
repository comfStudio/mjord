import { describe, it, ItArgs, TestSuite } from "std/testing/bdd";

function suiteMap<T>(
  testParam: any,
  name: string,
  map: Record<string, string>,
  suite?: TestSuite<T>
) {
  return describe({
    name,
    suite,
    beforeAll(this: any) {
      this.testParam = testParam;
      for (const key of Object.keys(map)) {
        this[key] = this[map[key]];
      }
    },
  });
}

export function itAnonAuth<T>(...args: ItArgs<T & { [k: string]: any }>) {
  let suite_idx = 0;
  let base_suite: any | undefined = args[suite_idx];
  if (!(base_suite as TestSuite<any>)?.symbol) {
    suite_idx = 1;
    base_suite = args[suite_idx];
    if (!(base_suite as TestSuite<any>)?.symbol) {
      base_suite = undefined;
    }
  }

  const anonSuite = suiteMap(
    "anon",
    "anonymous",
    {
      invoke: "anonInvoke",
      client: "anonClient",
    },
    base_suite
  );

  const anonArgs = args
    .slice(0, suite_idx)
    .concat(anonSuite, ...args.slice(suite_idx + (base_suite ? 1 : 0)));

  it(...(anonArgs as ItArgs<T>));

  const authSuite = suiteMap(
    "auth",
    "authenticated",
    {
      anonClient: "client",
      anonInvoke: "invoke",
    },
    base_suite
  );

  const authArgs = args
    .slice(0, suite_idx)
    .concat(authSuite, ...args.slice(suite_idx + (base_suite ? 1 : 0)));

  it(...(authArgs as ItArgs<T>));
}
