import {
  FunctionInvokeOptions,
  FunctionsResponse,
} from '@supabase/functions-js';

import { GroupWithMediaData, ProfileData } from './db.ts';
import { FunctionDataOp } from './schema.ts';
import { Join } from './utils.ts';

export interface InvokeOptions<T extends string, O extends string>
  extends FunctionInvokeOptions {
  body: {
    type: O;
  } & Omit<FunctionRequestMap[FunctionOp<T, O>], "type">;
}

export type FunctionName = "profile" | "group" | "featured";

type FunctionOp<T extends string, O extends string> = Join<[T, O], "_">;

export type InvokeReturn<
  T extends FunctionName,
  O extends string
> = FunctionsResponse<FunctionResponseMap<T, O>[FunctionOp<T, O>]>;

export type Invoke<T extends FunctionName, O extends string> = (
  name: T,
  options: InvokeOptions<T, O>
) => Promise<InvokeReturn<T, O>>;

type InvokeBody<T extends string, O extends string> = InvokeOptions<
  T,
  O
>["body"];

export interface FunctionResponseMap<T extends string, O extends string> {
  profile_get: ProfileData;
  featured_get: InvokeBody<T, O> extends { get: "get" }
    ? InvokeBody<T, O> extends { entity: "group" }
      ? GroupWithMediaData[]
      : never
    : never;
  [key: string]: unknown;
}

export interface FunctionRequestMap extends FunctionDataOp {
  [key: string]: unknown;
}

// --------------------------------------------------
