import { z } from "zod";
import { FunctionsHttpError } from "@supabase/functions-js";
type PrettifyObject<T> = {
    [KeyType in keyof T]: T[KeyType];
} & {};
type NonOptional<T, K extends keyof T> = Required<Pick<T, K>> & T;
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
export declare function responseData<T extends z.ZodUnknown>(dataSchema: T): z.ZodIntersection<z.ZodObject<{
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
    }, {
        message: string;
    }>>;
}, "strip", z.ZodTypeAny, { [k_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
    }, {
        message: string;
    }>>;
}>, undefined extends T["_output"] | undefined ? never : "data">]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
    }, {
        message: string;
    }>>;
}>, undefined extends T["_output"] | undefined ? never : "data">[k_1]; }, { [k_2 in keyof z.baseObjectInputType<{
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
    }, {
        message: string;
    }>>;
}>]: z.baseObjectInputType<{
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
    }, {
        message: string;
    }>>;
}>[k_2]; }>, z.ZodUnion<[z.ZodObject<{
    data: z.ZodUndefined;
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
}>, z.ZodObject<{
    data: T;
    error: z.ZodUndefined;
}, "strip", z.ZodTypeAny, { [k_1_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    data: T;
    error: z.ZodUndefined;
}>, undefined extends T["_output"] ? never : "data">]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    data: T;
    error: z.ZodUndefined;
}>, undefined extends T["_output"] ? never : "data">[k_1_1]; }, { [k_2_1 in keyof z.baseObjectInputType<{
    data: T;
    error: z.ZodUndefined;
}>]: z.baseObjectInputType<{
    data: T;
    error: z.ZodUndefined;
}>[k_2_1]; }>]>>;
export declare const anyResponseData: z.ZodIntersection<z.ZodObject<{
    data: z.ZodOptional<z.ZodUnknown>;
    error: z.ZodOptional<z.ZodObject<{
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
    }, {
        message: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    data?: unknown;
    error?: {
        message: string;
    } | undefined;
}, {
    data?: unknown;
    error?: {
        message: string;
    } | undefined;
}>, z.ZodUnion<[z.ZodObject<{
    data: z.ZodUndefined;
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
}>, z.ZodObject<{
    data: z.ZodUnknown;
    error: z.ZodUndefined;
}, "strip", z.ZodTypeAny, {
    data?: unknown;
    error?: undefined;
}, {
    data?: unknown;
    error?: undefined;
}>]>>;
export type ResponseData<T> = PrettifyObject<(Omit<z.infer<typeof anyResponseData>, "data"> & {
    data: T;
    error?: undefined;
}) | NonOptional<z.infer<typeof anyResponseData>, "error">>;
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
export type FunctionResponse = ({
    data: any;
} & {
    error: null;
}) | ({
    error: FunctionsHttpError;
} & {
    data: null;
});
export declare const functionDataOp: {
    featured_get: z.ZodObject<{
        type: z.ZodLiteral<"get">;
        entity: z.ZodEnum<["group", "event"]>;
    }, "strip", z.ZodTypeAny, {
        type: "get";
        entity: "group" | "event";
    }, {
        type: "get";
        entity: "group" | "event";
    }>;
};
export type FunctionDataOp = {
    [K in keyof typeof functionDataOp]: z.infer<(typeof functionDataOp)[K]>;
};
export {};
//# sourceMappingURL=schema.d.ts.map