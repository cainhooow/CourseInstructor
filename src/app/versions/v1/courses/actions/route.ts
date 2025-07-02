import AuthMiddleware from "@/app/middleware/auth.middleware";
import { Controller, Middlewares, Post, Route } from "@fastexpress/http";

@Route("/:course")
@Middlewares([new AuthMiddleware("jwt")])
export default class CourseActionsController extends Controller {
  @Post("/:course/add-cart")
  async addToCart() {}

  @Post("/:course/add-comment")
  async addComment() {}

  @Post("/:course/add-rating")
  async addRating() {}

  public route(): void {}
}
