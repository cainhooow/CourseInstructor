import Logger from "@/app/utils/Logger";
import ResponseNotFound from "../errors/ResponseNotFound";

export interface IResponse {
  make<T>(): T | T[] | Error;
  addField(key: string, data: any): this;
}

export class Response implements IResponse {
  protected include: Record<string, any> = {};

  constructor(protected data?: any) {}

  addField(key: string, data: any): this {
    Logger.log("DEBUG", `additional field: ${key} to response data`);
    this.include[key] = data;
    return this;
  }

  make<T>(): T | T[] | Error {
    if (!this.data) {
      throw new ResponseNotFound("responses.empty");
    }

    if (Array.isArray(this.data) && this.data.length <= 0) {
      throw new ResponseNotFound("responses.empty");
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
