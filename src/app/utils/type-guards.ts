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

  static toUser<T>(data: T): T {
    return data;
  }

  static toProfile<T>(data: T) {
    return data;
  }
}
