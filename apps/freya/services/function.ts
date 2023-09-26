import constant, { constantEmitter, ServiceType } from "@app/constants";
import { FunctionError } from "@app/misc/error";
import RaiseError, { NoOpError } from "@mjord/common/error";
import { InvokeOptions, InvokeReturn } from "@mjord/edge/functions";
import { FunctionName, RequestType } from "@mjord/edge/schema";
import { FunctionsHttpError } from "@supabase/supabase-js";
import {
  QueryCache,
  QueryClient,
  QueryFunction,
  QueryFunctionContext,
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

let waiting = false;

function createQueryFunc<T extends FunctionName, Opt extends InvokeOptions<T, RequestType> = never>(
  name: T,
  options?: Opt
) {
  return (async ({ signal, queryKey }: QueryFunctionContext) => {
    let service = constant.service?.get?.(ServiceType.Function);

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

        signal.addEventListener("abort", () => {
          resolve();
        });

        setTimeout(() => {
          reject(new NoOpError("Service not initialized [timeout error]"));
        });
      });

      if (signal.aborted) {
        return undefined;
      }
      service = constant.service?.get?.(ServiceType.Function);
    }

    if (!service) {
      throw new NoOpError("Service not initialized");
    }

    const data = await service.invoke(name, {
      // signal,
      ...options,
    } as Opt);

    return data;
  }) as QueryFunction<NonNullable<FunctionReturn<T, Opt>["data"]>>;
}

export function useSupabaseClient() {
  return constant.supabase;
}

export function useFunction<T extends FunctionName, Opt extends InvokeOptions<T, RequestType> = never>(
  name: T,
  options?: Opt,
  queryOptions?: UseQueryOptions<
    NonNullable<FunctionReturn<T, Opt>["data"]>,
    NonNullable<FunctionReturn<T, Opt>["error"]>
  >
) {
  const key = ["function", name, options];

  return useQuery({
    queryKey: key,
    queryFn: createQueryFunc<T, Opt>(name, options),
    ...queryOptions,
  }) as UseQueryResult<NonNullable<FunctionReturn<T, Opt>["data"]>, NonNullable<FunctionReturn<T, Opt>["error"]>>;
}

export function queryFunction<T extends FunctionName, Opt extends InvokeOptions<T, RequestType> = never>(
  name: T,
  options?: Opt,
  queryOptions?: UseQueryOptions<
    NonNullable<FunctionReturn<T, Opt>["data"]>,
    NonNullable<FunctionReturn<T, Opt>["error"]>
  >
) {
  const client = getQueryClient();

  const key = ["function", name, options];

  return client.fetchQuery({
    queryKey: key,
    queryFn: createQueryFunc<T, Opt>(name, options),
    ...queryOptions,
  });
}
