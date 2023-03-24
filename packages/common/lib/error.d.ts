export declare enum ErrorCode {
    UnknownError = 0,
    NoOpError = 1,
    GenericError = 2,
    DatabaseError = 3,
    ValidationError = 4
}
export declare class UnknownError extends Error {
    code: ErrorCode;
    __proto__?: Error;
    constructor(...args: any[]);
    get name(): string;
    toJSON(): {
        name: string;
        message: string;
        code: ErrorCode;
        stacktrace: string[] | undefined;
    };
}
export declare class NoOpError extends UnknownError {
}
export declare class GenericError extends UnknownError {
}
export declare class AuthenticationError extends UnknownError {
}
export declare class DatabaseError extends UnknownError {
}
export declare class ValidationError extends UnknownError {
    errors: Record<string, any>[];
    constructor(message: string, errors: Record<string, any>[]);
}
export declare class PermissionError extends UnknownError {
}
export declare class TemplateError extends NoOpError {
}
export default class RaiseError {
    static NotImplemented(): void;
    static ValidationError(errors: Record<string, any>[], message?: string): void;
}
//# sourceMappingURL=error.d.ts.map