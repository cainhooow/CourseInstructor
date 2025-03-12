export interface Error {
  message: string;
}

export interface IResponse {
  make<T>(): T | T[] | Error;
}

export class Response implements IResponse {
  constructor(protected data?: any) {}

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
    return data;
  }
}
