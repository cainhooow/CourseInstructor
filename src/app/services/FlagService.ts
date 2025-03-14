import FlagRepository, { CreatableFlag } from "../repositories/system/FlagRepo";

export default class FlagService {
  constructor(protected repository = new FlagRepository()) {}

  public async selectOnly(flags: CreatableFlag[]) {
    return await this.repository.selectOnly(flags);
  }
}
