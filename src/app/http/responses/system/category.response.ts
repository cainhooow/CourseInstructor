import { CategoryDTO } from "@/app/dto/system/category.dto";
import { Response } from "../response";

export default class CategoryResponse extends Response {
  constructor(protected readonly data: CategoryDTO | CategoryDTO[]) {
    super(data);
  }

  protected makeData<_T>(data: CategoryDTO) {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      ...this.include,
    };
  }
}
