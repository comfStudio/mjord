import { ExtendableError } from "ts-error";

import { getEnumMembersMKeyMap } from "./utility";

// IMPORTANT: Don't reorder this
export enum ErrorCode {
  UnknownError,
  NoOpError,
  GenericError,
  DatabaseError,
  ValidationError,
}

const ErrorCodeMembersMap = getEnumMembersMKeyMap(ErrorCode);

export class UnknownError extends ExtendableError {
  code: ErrorCode;

  constructor(...args: any[]) {
    const message = args.map((v) => v.toString()).join(" ");
    super(message);
    this.message = message;
    this.code = ErrorCode[ErrorCodeMembersMap[this.name]];
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      stacktrace: this.stack?.split("    "),
    };
  }
}

export class NoOpError extends UnknownError {}
export class GenericError extends UnknownError {}

export default class RaiseError {
  static NotImplemented() {
    throw new NoOpError("Not implemented");
  }
}
