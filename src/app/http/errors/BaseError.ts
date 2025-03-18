export class BaseError extends Error {
  public code: number;
  public message: string;

  constructor(message?: string, code?: number) {
    super(message);
    this.name = this.constructor.name;
    this.message = message || "Internal Server Error";
    this.code = code || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}
