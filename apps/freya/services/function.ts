import constant, { ServiceType } from '@app/constants';
import { FunctionError } from '@app/misc/error';
import RaiseError from '@mjord/common/lib/error';
import { InvokeOptions, InvokeReturn } from '@mjord/edge/functions';
import { FunctionName, RequestType } from '@mjord/edge/schema';
import { FunctionsHttpError } from '@supabase/supabase-js';
import {
  QueryClient,
  QueryFunction,
  QueryFunctionContext,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { Service } from './base';

export type FunctionReturn<
  T extends FunctionName,
  Opt extends InvokeOptions<T, RequestType> | undefined
> =
  | {
      data: Opt extends InvokeOptions<T, any>
        ? NonNullable<InvokeReturn<T, Opt["body"]>["data"]>
        : unknown;
      error: undefined;
    }
  | {
      data: undefined;
      error: FunctionError<
        Opt extends InvokeOptions<T, any>
          ? NonNullable<InvokeReturn<T, Opt["body"]>["error"]>
          : never
      >;
    };
export default class Function extends Service {
  constructor() {
    super(ServiceType.Function);
  }

  async init() {}

  async invoke<
    T extends FunctionName,
    Opt extends InvokeOptions<T, RequestType> | undefined = undefined
  >(name: T, options?: Opt) {
    const { data, error } = await this.safeInvoke(name, options);

    if (error) {
      throw error;
    }

    return data as NonNullable<FunctionReturn<T, Opt>["data"]>;
  }

  async safeInvoke<
    T extends FunctionName,
    Opt extends InvokeOptions<T, RequestType> | undefined = undefined
  >(name: T, options?: Opt): Promise<FunctionReturn<T, Opt>> {
    const { data: d, error: e } = await constant.supabase.functions.invoke(
      name,
      options
    );

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

function createQueryFunc<
  T extends FunctionName,
  Opt extends InvokeOptions<T, RequestType> = never
>(name: T, options?: Opt) {
  const service = constant.service.get(ServiceType.Function);

  return (async ({ signal }: QueryFunctionContext) => {
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

export function useFunction<
  T extends FunctionName,
  Opt extends InvokeOptions<T, RequestType> = never
>(
  name: T,
  options?: Opt,
  queryOptions?: UseQueryOptions<
    NonNullable<FunctionReturn<T, Opt>["data"]>,
    NonNullable<FunctionReturn<T, Opt>["error"]>
  >
) {
  const key = ["function", name, options];

  return useQuery(key, createQueryFunc<T, Opt>(name, options), {
    ...(queryOptions as any),
  }) as UseQueryResult<
    NonNullable<FunctionReturn<T, Opt>["data"]>,
    NonNullable<FunctionReturn<T, Opt>["error"]>
  >;
}

export function queryFunction<
  T extends FunctionName,
  Opt extends InvokeOptions<T, RequestType> = never
>(
  name: T,
  options?: Opt,
  queryOptions?: UseQueryOptions<
    NonNullable<FunctionReturn<T, Opt>["data"]>,
    NonNullable<FunctionReturn<T, Opt>["error"]>
  >
) {
  const client = getQueryClient();

  const key = ["function", name, options];

  return client.fetchQuery(
    key,
    createQueryFunc<T, Opt>(name, options),
    queryOptions
  );
}
