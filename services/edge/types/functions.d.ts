import { FunctionInvokeOptions, FunctionsResponse } from "@supabase/functions-js";
import { GroupWithMediaData, ProfileWithMediaData } from "./db.ts";
import { FunctionDataOp, FunctionName, RequestType, ResponseFailData, ResponseSuccessData } from "./schema.ts";
import { Join } from "./utils.ts";
export interface FunctionResponseMap<T extends string, B extends InvokeBody<T, string>> {
    profile_get: ProfileWithMediaData;
    featured_get: B extends {
        entity: "group";
    } ? GroupWithMediaData[] : never;
    [key: string]: unknown;
}
export interface InvokeOptions<T extends string, O extends string> extends FunctionInvokeOptions {
    body: FunctionRequestMap[FunctionOp<T, O>];
}
type FunctionOp<T extends string, O extends string> = Join<[T, O], "_">;
export type InvokeReturn<T extends FunctionName, B extends InvokeBody<T, string>> = ResponseSuccessData<FunctionResponseMap<T, B>[FunctionOp<T, B extends {
    type: string;
} ? B["type"] : never>]> | ResponseFailData;
export type InvokeFunctionResponse<T extends FunctionName, O extends RequestType, B extends InvokeBody<T, O>> = FunctionsResponse<FunctionResponseMap<T, B>[FunctionOp<T, O>]>;
export type Invoke<T extends FunctionName, O extends RequestType, Opt extends InvokeOptions<T, O>> = (name: T, options: O) => Promise<InvokeReturn<T, Opt["body"]>>;
type InvokeBody<T extends string, O extends string> = InvokeOptions<T, O>["body"];
export interface FunctionRequestMap extends FunctionDataOp {
    [key: string]: {};
}
export {};
//# sourceMappingURL=functions.d.ts.map