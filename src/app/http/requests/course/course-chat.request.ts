import { Request as ExpressRequest } from "express";
import Request from "../request";

type TCourseChatRequest = {
  name: string;
  description: string;
  course: string;
};

export default class CourseChatRequest extends Request<TCourseChatRequest> {
  constructor(protected readonly req: ExpressRequest) {
    super(req, ["name", "description", "course"]);
  }

  protected rules(): Record<string, string> {
    return {
      name: "string|max:150|min:5",
      description: "string|max:1000|min:5",
      course: "string|min:15",
    };
  }
}
