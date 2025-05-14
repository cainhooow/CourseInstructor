import { Category, Prisma } from "@prisma/client";
import Repository from "../repository";
import { $ } from "@/app/database";

export default class CategoryRepository extends Repository<
  Category,
  Prisma.CategoryInclude
> {
  public async index() {
    const includes = this.getIncludes();

    const data = await $.category.findMany({
      include: includes,
    });

    return data as
      | Prisma.CategoryGetPayload<{
          include: typeof includes;
        }>[]
      | null;
  }
}
