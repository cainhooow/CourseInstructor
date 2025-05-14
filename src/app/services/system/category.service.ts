import CategoryRepository from "@/app/repositories/system/category.repository";

export default class CategoryServive {
  constructor(protected readonly repository = new CategoryRepository()) {}

  public async index() {
    return await this.repository.index();
  }
}
