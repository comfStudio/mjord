import { z } from "zod";

import { FunctionsHttpError } from "@supabase/functions-js";

type PartialExcept<T, K extends keyof T> = Pick<T, K> & Partial<T>;
type PrettifyObject<T> = { [KeyType in keyof T]: T[KeyType] } & {};
type NonOptional<T, K extends keyof T> = Required<Pick<T, K>> & T;

const DataOpType = ["get", "update"] as const;
export type DataOpType = (typeof DataOpType)[number];

const RequestType = DataOpType;
export type RequestType = (typeof RequestType)[number];

export const error = z.object({
  message: z.string(),
});

export type ErrorData = z.infer<typeof error>;

export function responseSuccessData<T extends z.ZodUnknown>(dataSchema: T) {
  return z.object({
    data: dataSchema,
    error: z.undefined().optional(),
  });
}

export function responseFailData<T extends z.ZodUnknown>() {
  return z.object({
    data: z.undefined().optional(),
    error,
  });
}

export function responseData<T extends z.ZodUnknown>(dataSchema: T) {
  return z.union([responseSuccessData(dataSchema), responseFailData()]);
}

export const anyResponseData = responseData(z.unknown());

export type ResponseSuccessData<T> = { data: T; error?: undefined };
export type ResponseFailData<E = unknown> = {
  data?: undefined;
  error: z.infer<typeof error>;
};

export type ResponseData<T> = PrettifyObject<
  ResponseSuccessData<T> | ResponseFailData
>;

export const requestData = z.object({
  type: z.enum(RequestType),
});

export type RequestBody = z.infer<typeof requestData>;

export const requestDataOp = requestData.extend({
  type: z.enum(DataOpType),
});

export type RequestDataOp = z.infer<typeof requestDataOp>;

export type FunctionResponse<T = any> =
  | ({ data: T } & {
      error: null;
    })
  | ({ error: FunctionsHttpError } & {
      data: null;
    });

type RemoveOpSuffix<T> = T extends `${infer U}_${RequestType}` ? U : T;
export type GetDataOpKeys<
  T extends string,
  K extends `${T}_${RequestType}` = `${T}_${RequestType}`
> = K extends keyof FunctionDataOp ? K : never;

export type FunctionNameDataOpMap<
  T extends RemoveOpSuffix<keyof FunctionDataOp>
> = FunctionDataOp[GetDataOpKeys<T>];

// -----------------------------------------------------------

const dataOpMap = DataOpType.reduce(
  (acc, op) => {
    // @ts-ignore: .
    acc[op] = z.literal(op);
    return acc;
  },
  {} as {
    [K in DataOpType]: z.ZodLiteral<K>;
  }
);

export type FunctionName = "profile" | "group" | "featured";

export const functionDataOp = {
  profile_get: requestDataOp.extend({
    type: dataOpMap.get,
  }),
  group_get: requestDataOp.extend({
    type: dataOpMap.get,
  }),
  featured_get: requestDataOp.extend({
    type: dataOpMap.get,
    entity: z.enum(["group", "event"]),
  }),
};

export type FunctionDataOp = {
  [K in keyof typeof functionDataOp]: z.infer<(typeof functionDataOp)[K]>;
};
