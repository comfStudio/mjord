import constant, { constantEmitter, ServiceType } from "@app/constants";
import { FunctionError } from "@app/misc/error";
import RaiseError, { NoOpError } from "@mjord/common/error";
import { LRUCacheMap, queuedThrottle, throttle } from "@mjord/common/utility";
import { InvokeOptions, InvokeReturn } from "@mjord/edge/functions";
import { FunctionName, RequestType } from "@mjord/edge/schema";
import { FunctionsHttpError } from "@supabase/supabase-js";
import {
  QueryCache,
  QueryClient,
  QueryFunction,
  QueryFunctionContext,
  QueryOptions,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import { Service } from "./base";

export type FunctionReturn<T extends FunctionName, Opt extends InvokeOptions<T, RequestType> | undefined> =
  | {
      data: Opt extends InvokeOptions<T, any> ? NonNullable<InvokeReturn<T, Opt["body"]>["data"]> : unknown;
      error: undefined;
    }
  | {
      data: undefined;
      error: FunctionError<
        Opt extends InvokeOptions<T, any> ? NonNullable<InvokeReturn<T, Opt["body"]>["error"]> : never
      >;
    };
export default class Function extends Service {
  constructor() {
    super(ServiceType.Function);
  }

  async init() {}

  async invoke<T extends FunctionName, Opt extends InvokeOptions<T, RequestType> | undefined = undefined>(
    name: T,
    options?: Opt
  ) {
    const { data, error } = await this.safeInvoke(name, options);

    if (error) {
      throw error;
    }

    return data as NonNullable<FunctionReturn<T, Opt>["data"]>;
  }

  async safeInvoke<T extends FunctionName, Opt extends InvokeOptions<T, RequestType> | undefined = undefined>(
    name: T,
    options?: Opt
  ): Promise<FunctionReturn<T, Opt>> {
    constant.log.i("Invoking function", name);
    const { data: d, error: e } = await constant.supabase.functions.invoke(name, options);

    let error: FunctionReturn<T, Opt>["error"] = d?.error;

    if (e instanceof FunctionsHttpError) {
      const err = (await e?.context?.json())?.error;
      const msg = err?.message ?? e?.context?.statusText ?? e?.message;
      error = new FunctionError(name, err, e?.context?.status, msg);
    } else if (e) {
      RaiseError.NotImplemented();
    }

    return {
      data: d?.data,
      error,
    };
  }
}

export function getQueryClient() {
  let queryClient: QueryClient | undefined = constant.client;

  if (!queryClient) {
    queryClient = new QueryClient({
      queryCache: new QueryCache({
        onError: (err, query) => {
          constant.log.e(`Query error [${query.queryKey}]: `, err?.message);
        },
      }),
      defaultOptions: {
        mutations: {},
        queries: {
          retry: 2,
          staleTime: process.env.NODE_ENV !== "production" ? Infinity : 1000 * 60 * 60 * 1, // 1 hours
        },
      },
    });
  }

  return queryClient;
}

type QFunc<T extends FunctionName, Opt extends InvokeOptions<T, RequestType>> = QueryFunction<
  NonNullable<FunctionReturn<T, Opt>["data"]>
> & {
  cancel: () => void;
};

const throttleMap = new LRUCacheMap<QFunc<any, any>, string>(1000);

type CustomOptions = {
  throttle?: {
    enable?: boolean;
    wait: number;
    key?: any;
  };
};

function createQueryFunc<T extends FunctionName, Opt extends InvokeOptions<T, RequestType> = never>(
  queryKey: any,
  name: T,
  options?: Opt,
  customOptions?: CustomOptions
) {
  const key = JSON.stringify({ queryKey, customOptions });

  const throttleOptions = customOptions?.throttle ?? ({} as NonNullable<CustomOptions["throttle"]>);
  throttleOptions.enable = throttleOptions.enable ?? true;
  throttleOptions.wait = throttleOptions.wait ?? 500;

  const tKey = throttleOptions.key ?? key;
  if (throttleOptions.enable && throttleMap.has(tKey)) {
    return throttleMap.get(tKey) as QFunc<T, Opt>;
  }

  const f = async ({ signal, queryKey }: QueryFunctionContext) => {
    const service = constant.service?.get?.(ServiceType.Function);

    const data = await service.invoke(name, {
      // signal,
      ...options,
    } as Opt);

    return data;
  };

  let func = f;

  let throttled: ReturnType<typeof queuedThrottle> | undefined = undefined;
  if (throttleOptions.enable) {
    throttled = queuedThrottle((...args) => {
      return new Promise((resolve, reject) => {
        // @ts-expect-error: .
        (f(...args) as Promise<T>)
          .then((v) => {
            return resolve(v);
          })
          .catch(reject);
      });
    }, throttleOptions.wait);

    func = async (...args) => {
      return throttled!(...args).then((v) => v ?? null);
    };
  }

  const final = (async (args: QueryFunctionContext) => {
    let service = constant.service?.get?.(ServiceType.Function);

    if (throttled) {
      args.signal.addEventListener("abort", () => {
        throttled?.cancel();
      });
    }

    if (!service && !constant.initialized) {
      await new Promise<void>((resolve, reject) => {
        constant.log?.i("Query waiting for service initialization:", queryKey);
        constantEmitter.once("initialized", (s) => {
          if (s) {
            resolve();
          } else {
            reject(new NoOpError("Service not initialized [failed to initialize]"));
          }
        });

        args.signal.addEventListener("abort", () => {
          resolve();
        });

        setTimeout(() => {
          reject(new NoOpError("Service not initialized [timeout error]"));
        });
      });

      if (args.signal.aborted) {
        return null;
      }
      service = constant.service?.get?.(ServiceType.Function);
    }

    if (!service) {
      throw new NoOpError("Service not initialized");
    }

    return func(args);
  }) as QFunc<T, Opt>;

  if (throttleOptions.enable) {
    throttleMap.set(tKey, final);
  }

  final.cancel = () => {
    if (throttled) {
      throttled.cancel();
    }
  };

  return final;
}

export function useSupabaseClient() {
  return constant.supabase;
}

export function useFunction<T extends FunctionName, Opt extends InvokeOptions<T, RequestType> = never>(
  name: T,
  options?: Opt,
  queryOptions?: Omit<
    UseQueryOptions<NonNullable<FunctionReturn<T, Opt>["data"]>, NonNullable<FunctionReturn<T, Opt>["error"]>>,
    "queryKey"
  > &
    CustomOptions
) {
  const key = ["function", name, options];

  const queryFn = createQueryFunc<T, Opt>(key, name, options, queryOptions);

  return useQuery({
    queryKey: key,
    queryFn,
    ...queryOptions,
  }) as UseQueryResult<NonNullable<FunctionReturn<T, Opt>["data"]>, NonNullable<FunctionReturn<T, Opt>["error"]>>;
}

export function queryFunction<T extends FunctionName, Opt extends InvokeOptions<T, RequestType> = never>(
  name: T,
  options?: Opt,
  queryOptions?: Omit<
    QueryOptions<NonNullable<FunctionReturn<T, Opt>["data"]>, NonNullable<FunctionReturn<T, Opt>["error"]>>,
    "queryKey"
  > &
    CustomOptions
) {
  const client = getQueryClient();

  const key = ["function", name, options];

  return client.fetchQuery({
    queryKey: key,
    queryFn: createQueryFunc<T, Opt>(key, name, options, queryOptions),
    ...queryOptions,
  });
}
