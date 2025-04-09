import { Request } from "express";
import { UserDTO } from "../dto/user/user.dto";

export namespace TypeGuards {
  export type Modify<T, R> = Omit<T, keyof R> & R;
  export type AuthRequest = Modify<Request, { user: UserDTO }>;
}

export default class Guard {
  static assignObject<T, K extends string, V>(data?: T): T & { [P in K]: V } {
    return data as T & { [P in K]: V };
  }

  static selectOnly<T, K extends keyof T>(
    data: T
  ): Pick<T, K> & Partial<Record<Exclude<keyof T, K>, never>> {
    return data as any;
  }

  static assumeAs<U>(data: unknown): U {
    return data as U;
  }

  static isNull<T>(data: T | null) {
    return !data;
  }

  static isUndefined<T>(data: T | undefined) {
    return typeof data === "undefined";
  }

  static toUser<T>(data: T | undefined): T {
    if (!data) throw new Error("user is undefined");
    return data;
  }

  static toProfile<T>(data: T) {
    return data;
  }
}
