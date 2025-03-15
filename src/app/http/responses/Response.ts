export interface Error {
  message: string;
}

export interface IResponse {
  make<T>(): T | T[] | Error;
  addField(key: string, data: any): this;
}

export class Response implements IResponse {
  protected include: Record<string, any> = {};

  constructor(protected data?: any) {}

  addField(key: string, data: any): this {
    this.include[key] = data;
    return this;
  }

  make<T>(): T | T[] | Error {
    if (!this.data) {
      return { message: `This data is undefined` };
    }

    if (Array.isArray(this.data) && this.data.length <= 0) {
      return { message: `This data is empty` };
    }

    if (Array.isArray(this.data)) {
      return this.data.map((item: T) => this.makeData(item)) as T[];
    }

    return this.makeData(this.data) as T;
  }

  protected makeData<_T>(data: any) {
    return {
      ...data,
      ...this.include,
    };
  }
}
