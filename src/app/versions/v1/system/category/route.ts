import { Request, Response } from "express";
import { Get, Route } from "@fastexpress/http";
import { Controller } from "@fastexpress/http";
import { CategoryDTO } from "@/app/dto/system/category.dto";
import CategoryServive from "@/app/services/system/category.service";
import CategoryResponse from "@/app/http/responses/system/category.response";
import Guard from "@/app/utils/type-guards";

@Route("/categories")
export default class CategoriesRouter extends Controller {
  constructor(protected readonly service = new CategoryServive()) {
    super();
  }

  @Get("/")
  async index(_req: Request, res: Response) {
    const data = await this.service.index();
    return res.json(
      new CategoryResponse(Guard.assumeAs<CategoryDTO[]>(data)).make()
    );
  }

  public route(): void {}
}
