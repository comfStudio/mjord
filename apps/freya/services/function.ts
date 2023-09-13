import constant, { ServiceType } from "@app/constants";
import {
  FunctionName,
  InvokeOptions,
  InvokeReturn,
} from "@mjord/edge/functions";
import { FunctionsHttpError } from "@supabase/supabase-js";
import {
  QueryClient,
  QueryFunction,
  QueryFunctionContext,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import { Service } from "./base";

export default class Function extends Service {
  constructor() {
    super(ServiceType.Function);
  }

  async init() {}

  async invoke<T extends FunctionName, O extends string>(
    name: T,
    options?: InvokeOptions<T, O>
  ): Promise<InvokeReturn<T, O>> {
    return constant.supabase.functions.invoke(name, options);
  }
}

let queryClient: QueryClient | undefined;

export function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: {},
        queries: {
          staleTime:
            process.env.NODE_ENV !== "production"
              ? Infinity
              : 1000 * 60 * 60 * 1, // 1 hours
        },
      },
    });
  }

  return queryClient;
}

function createQueryFunc<T extends FunctionName, O extends string>(
  name: T,
  options?: InvokeOptions<T, O>
) {
  const service = constant.service.get(ServiceType.Function);

  return (async ({ signal }: QueryFunctionContext) => {
    const { data, error } = await service.invoke(name, {
      // signal,
      ...options,
    } as InvokeOptions<T, O>);

    if (error instanceof FunctionsHttpError) {
      throw (await error?.context.json())?.error;
    }

    return data;
  }) as QueryFunction<InvokeReturn<T, O>["data"]>;
}

export function useSupabaseClient() {
  return constant.supabase;
}

export function useFunction<T extends FunctionName, O extends string>(
  name: T,
  options?: InvokeOptions<T, O>,
  queryOptions?: UseQueryOptions<
    InvokeReturn<T, O>["data"],
    InvokeReturn<T, O>["error"]
  >
) {
  const key = ["function", name, options];

  return useQuery(key, createQueryFunc<T, O>(name, options), {
    ...(queryOptions as any),
  }) as UseQueryResult<InvokeReturn<T, O>["data"], InvokeReturn<T, O>["error"]>;
}

export function queryFunction<T extends FunctionName, O extends string>(
  name: T,
  options?: InvokeOptions<T, O>,
  queryOptions?: UseQueryOptions<
    InvokeReturn<T, O>["data"],
    InvokeReturn<T, O>["error"]
  >
) {
  const client = getQueryClient();

  const key = ["function", name, options];

  return client.fetchQuery(
    key,
    createQueryFunc<T, O>(name, options),
    queryOptions
  );
}
