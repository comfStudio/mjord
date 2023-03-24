import { getEnumMembersMKeyMap } from './utility';

// IMPORTANT: Don't reorder this
export enum ErrorCode {
    UnknownError,
    NoOpError,
    GenericError,
    DatabaseError,
    ValidationError,
}

const ErrorCodeMembersMap = getEnumMembersMKeyMap(ErrorCode);

export class UnknownError extends Error {
    code: ErrorCode;

    __proto__?: Error;

    constructor(...args: any[]) {
        const actualProto = new.target.prototype;
        const message = args.map((v) => v.toString()).join(' ');
        super(message);
        this.message = message;
        this.code = ErrorCode[ErrorCodeMembersMap[this.name]];

        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        } else {
            // eslint-disable-next-line no-proto
            this.__proto__ = actualProto;
        }
    }

    get name() {
        return this.constructor.name;
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            stacktrace: this.stack?.split('    '),
        };
    }
}

export class NoOpError extends UnknownError { }
export class GenericError extends UnknownError { }
export class AuthenticationError extends UnknownError { }
export class DatabaseError extends UnknownError {


}
export class ValidationError extends UnknownError {
    constructor(message: string, public errors: Record<string, any>[]) {
        super(message);
    }
}
export class PermissionError extends UnknownError { }
export class TemplateError extends NoOpError { }

export default class RaiseError {
    static NotImplemented() {
        throw new NoOpError('Not implemented');
    }

    static ValidationError(errors: Record<string, any>[], message = '') {
        throw new ValidationError(message + errors[0].message, errors);

    }
}
