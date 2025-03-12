export interface IRequest {
  validate(): boolean;
  hasErrors(): string[]
  getData<T>(): T;
}

export default class Request implements IRequest {
  protected errors: string[] = [];

  constructor(
    protected data: Record<string, any>,
    private requiredFields: string[]
  ) {}

  public validate(): boolean {
    this.errors = [];

    if (typeof this.data === "undefined") {
      this.errors.push("Validation failed: Missing required data");
      return false;
    }

    for (const field of this.requiredFields) {
      if (!(field in this.data)) {
        console.error(`Validation failed: Missing ${field}`);
        this.errors.push(`Missing field: ${field}`)
        return false;
      }
    }

    this.validation();
    return this.errors.length === 0;
  }

  protected validation(): boolean {
    return true;
  }

  public hasErrors(): string[] {
      return this.errors;
  }

  public getData<T>(): T {
      return this.data as T;
  }
}
