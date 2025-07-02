import { Controller, Get, Route } from "@fastexpress/http";

@Route("/messages")
export default class CourseMessageRoute extends Controller {
  @Get("/")
  async index() {}
}
