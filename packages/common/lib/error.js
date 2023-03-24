import { getEnumMembersMKeyMap } from './utility';
// IMPORTANT: Don't reorder this
export var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["UnknownError"] = 0] = "UnknownError";
    ErrorCode[ErrorCode["NoOpError"] = 1] = "NoOpError";
    ErrorCode[ErrorCode["GenericError"] = 2] = "GenericError";
    ErrorCode[ErrorCode["DatabaseError"] = 3] = "DatabaseError";
    ErrorCode[ErrorCode["ValidationError"] = 4] = "ValidationError";
})(ErrorCode || (ErrorCode = {}));
const ErrorCodeMembersMap = getEnumMembersMKeyMap(ErrorCode);
export class UnknownError extends Error {
    constructor(...args) {
        const actualProto = new.target.prototype;
        const message = args.map((v) => v.toString()).join(' ');
        super(message);
        this.message = message;
        this.code = ErrorCode[ErrorCodeMembersMap[this.name]];
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        }
        else {
            // eslint-disable-next-line no-proto
            this.__proto__ = actualProto;
        }
    }
    get name() {
        return this.constructor.name;
    }
    toJSON() {
        var _a;
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            stacktrace: (_a = this.stack) === null || _a === void 0 ? void 0 : _a.split('    '),
        };
    }
}
export class NoOpError extends UnknownError {
}
export class GenericError extends UnknownError {
}
export class AuthenticationError extends UnknownError {
}
export class DatabaseError extends UnknownError {
}
export class ValidationError extends UnknownError {
    constructor(message, errors) {
        super(message);
        this.errors = errors;
    }
}
export class PermissionError extends UnknownError {
}
export class TemplateError extends NoOpError {
}
export default class RaiseError {
    static NotImplemented() {
        throw new NoOpError('Not implemented');
    }
    static ValidationError(errors, message = '') {
        throw new ValidationError(message + errors[0].message, errors);
    }
}
