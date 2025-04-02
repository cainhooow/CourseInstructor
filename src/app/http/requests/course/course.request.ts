import { Request as ExpressRequest } from "express";
import Request from "../request";

type TCourseRequest = {
  name: string;
  description: string;
  stock: number;
};

export default class CourseRequest extends Request<TCourseRequest> {
  constructor(protected readonly req: ExpressRequest) {
    super(req, ["name", "description"]);
  }

  protected rules(): Record<string, string> {
    return {
      name: "string|max:150|min:5",
      description: "string|max:1000|min:5",
      stock: "number|min:1",
    };
  }
}
