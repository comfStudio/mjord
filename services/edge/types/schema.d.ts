import { z } from "zod";
import { FunctionsHttpError } from "@supabase/functions-js";
type PrettifyObject<T> = {
    [KeyType in keyof T]: T[KeyType];
} & {};
declare const DataOpType: readonly ["get", "update"];
export type DataOpType = (typeof DataOpType)[number];
declare const RequestType: readonly ["get", "update"];
export type RequestType = (typeof RequestType)[number];
export declare const error: z.ZodObject<{
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
}, {
    message: string;
}>;
export type ErrorData = z.infer<typeof error>;
export declare function responseSuccessData<T extends z.ZodUnknown>(dataSchema: T): z.ZodObject<{
    data: T;
    error: z.ZodOptional<z.ZodUndefined>;
}, "strip", z.ZodTypeAny, { [k_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    data: T;
    error: z.ZodOptional<z.ZodUndefined>;
}>, undefined extends T["_output"] ? never : "data">]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    data: T;
    error: z.ZodOptional<z.ZodUndefined>;
}>, undefined extends T["_output"] ? never : "data">[k_1]; }, { [k_2 in keyof z.baseObjectInputType<{
    data: T;
    error: z.ZodOptional<z.ZodUndefined>;
}>]: z.baseObjectInputType<{
    data: T;
    error: z.ZodOptional<z.ZodUndefined>;
}>[k_2]; }>;
export declare function responseFailData<T extends z.ZodUnknown>(): z.ZodObject<{
    data: z.ZodOptional<z.ZodUndefined>;
    error: z.ZodObject<{
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
    }, {
        message: string;
    }>;
}, "strip", z.ZodTypeAny, {
    error: {
        message: string;
    };
    data?: undefined;
}, {
    error: {
        message: string;
    };
    data?: undefined;
}>;
export declare function responseData<T extends z.ZodUnknown>(dataSchema: T): z.ZodUnion<[z.ZodObject<{
    data: T;
    error: z.ZodOptional<z.ZodUndefined>;
}, "strip", z.ZodTypeAny, { [k_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    data: T;
    error: z.ZodOptional<z.ZodUndefined>;
}>, undefined extends T["_output"] ? never : "data">]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    data: T;
    error: z.ZodOptional<z.ZodUndefined>;
}>, undefined extends T["_output"] ? never : "data">[k_1]; }, { [k_2 in keyof z.baseObjectInputType<{
    data: T;
    error: z.ZodOptional<z.ZodUndefined>;
}>]: z.baseObjectInputType<{
    data: T;
    error: z.ZodOptional<z.ZodUndefined>;
}>[k_2]; }>, z.ZodObject<{
    data: z.ZodOptional<z.ZodUndefined>;
    error: z.ZodObject<{
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
    }, {
        message: string;
    }>;
}, "strip", z.ZodTypeAny, {
    error: {
        message: string;
    };
    data?: undefined;
}, {
    error: {
        message: string;
    };
    data?: undefined;
}>]>;
export declare const anyResponseData: z.ZodUnion<[z.ZodObject<{
    data: z.ZodUnknown;
    error: z.ZodOptional<z.ZodUndefined>;
}, "strip", z.ZodTypeAny, {
    data?: unknown;
    error?: undefined;
}, {
    data?: unknown;
    error?: undefined;
}>, z.ZodObject<{
    data: z.ZodOptional<z.ZodUndefined>;
    error: z.ZodObject<{
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
    }, {
        message: string;
    }>;
}, "strip", z.ZodTypeAny, {
    error: {
        message: string;
    };
    data?: undefined;
}, {
    error: {
        message: string;
    };
    data?: undefined;
}>]>;
export type ResponseSuccessData<T> = {
    data: T;
    error?: undefined;
};
export type ResponseFailData<E = unknown> = {
    data?: undefined;
    error: z.infer<typeof error>;
};
export type ResponseData<T> = PrettifyObject<ResponseSuccessData<T> | ResponseFailData>;
export declare const requestData: z.ZodObject<{
    type: z.ZodEnum<["get", "update"]>;
}, "strip", z.ZodTypeAny, {
    type: "get" | "update";
}, {
    type: "get" | "update";
}>;
export type RequestBody = z.infer<typeof requestData>;
export declare const requestDataOp: z.ZodObject<{
    type: z.ZodEnum<["get", "update"]>;
}, "strip", z.ZodTypeAny, {
    type: "get" | "update";
}, {
    type: "get" | "update";
}>;
export type RequestDataOp = z.infer<typeof requestDataOp>;
export type FunctionResponse<T = any> = ({
    data: T;
} & {
    error: null;
}) | ({
    error: FunctionsHttpError;
} & {
    data: null;
});
type RemoveOpSuffix<T> = T extends `${infer U}_${RequestType}` ? U : T;
export type GetDataOpKeys<T extends string, K extends `${T}_${RequestType}` = `${T}_${RequestType}`> = K extends keyof FunctionDataOp ? K : never;
export type FunctionNameDataOpMap<T extends RemoveOpSuffix<keyof FunctionDataOp>> = FunctionDataOp[GetDataOpKeys<T>];
export type FunctionName = "profile" | "group" | "featured";
export declare const functionDataOp: {
    profile_get: z.ZodObject<{
        type: z.ZodLiteral<"get">;
    }, "strip", z.ZodTypeAny, {
        type: "get";
    }, {
        type: "get";
    }>;
    group_get: z.ZodObject<{
        type: z.ZodLiteral<"get">;
    }, "strip", z.ZodTypeAny, {
        type: "get";
    }, {
        type: "get";
    }>;
    featured_get: z.ZodObject<{
        type: z.ZodLiteral<"get">;
        entity: z.ZodEnum<["group", "event"]>;
    }, "strip", z.ZodTypeAny, {
        type: "get";
        entity: "event" | "group";
    }, {
        type: "get";
        entity: "event" | "group";
    }>;
};
export type FunctionDataOp = {
    [K in keyof typeof functionDataOp]: z.infer<(typeof functionDataOp)[K]>;
};
export {};
//# sourceMappingURL=schema.d.ts.map