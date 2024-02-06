import { UnknownError } from "@mjord/common";
import { ErrorData } from "@mjord/edge/schema";

export class FunctionError<E extends ErrorData> extends UnknownError {
  constructor(
    public readonly functionName: string,
    public readonly data: E | undefined,
    public readonly statusCode,
    message: string
  ) {
    super(`(/${functionName})`, message);
  }
}
