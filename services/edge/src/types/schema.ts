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

export function responseData<T extends z.ZodUnknown>(dataSchema: T) {
  return z
    .object({
      data: dataSchema.optional(),
      error: error.optional(),
    })
    .and(
      z.union([
        z.object({ data: z.undefined(), error }),
        z.object({ data: dataSchema, error: z.undefined() }),
      ])
    );
}

export const anyResponseData = responseData(z.unknown());

export type ResponseData<T> = PrettifyObject<
  | (Omit<z.infer<typeof anyResponseData>, "data"> & {
      data: T;
      error?: undefined;
    })
  | NonOptional<z.infer<typeof anyResponseData>, "error">
>;

export const requestData = z.object({
  type: z.enum(RequestType),
});

export type RequestBody = z.infer<typeof requestData>;

export const requestDataOp = requestData.extend({
  type: z.enum(DataOpType),
});

export type RequestDataOp = z.infer<typeof requestDataOp>;

export type FunctionResponse =
  | ({ data: any } & {
      error: null;
    })
  | ({ error: FunctionsHttpError } & {
      data: null;
    });

// -----------------------------------------------------------

export const functionDataOp = {
  featured_get: requestDataOp.extend({
    type: z.literal("get"),
    entity: z.enum(["group", "event"]),
  }),
};

export type FunctionDataOp = {
  [K in keyof typeof functionDataOp]: z.infer<(typeof functionDataOp)[K]>;
};
