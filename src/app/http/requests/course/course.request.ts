import { Request as ExpressRequest } from "express";
import Request from "../request";

type TCourseRequest = {
  name: string;
  description: string;
  banner_url?: string;
  demo_video_url?: string;
  tags: string[];
  stock: number;
  archived: boolean;
};

export default class CourseRequest extends Request<TCourseRequest> {
  constructor(protected readonly req: ExpressRequest) {
    super(req, [
      "name",
      "description",
      "banner_url",
      "demo_video_url",
      "tags",
      "stock",
      "archived",
    ]);
  }

  protected rules(): Record<string, string> {
    return {
      name: "string|max:150|min:5",
      description: "string|max:1000|min:5",
      banner_url: "url|min:5",
      demo_video_url: "url|min:5",
      tags: "string|min:5",
      archived: "boolean",
      stock: "number|min:1",
    };
  }
}
