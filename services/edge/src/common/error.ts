export class GenericError extends Error {
  constructor(msg: string, options?: ErrorOptions) {
    super(`${msg}`, options);
    this.name = this.constructor.name;
    this.message = `[${this.name}] -- ${msg}`;
  }
}

export class DatabaseError extends GenericError {}

export class DataNotFound extends DatabaseError {
  constructor(msg = "Data not found", options?: ErrorOptions) {
    super(msg, options);
  }
}
