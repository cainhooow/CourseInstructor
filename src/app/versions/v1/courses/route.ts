import { Controller, Route } from "@fastexpress/http";
import CourseActionsController from "./actions/route";

@Route("/courses")
export default class CourseController extends Controller {
  public route(): void {
    this.router.use(new CourseActionsController().getRouter());
  }
}
