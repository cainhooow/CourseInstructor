import FlagRepository, {
  CreatableFlag,
} from "../../repositories/system/flag.repository";

export default class FlagService {
  constructor(protected readonly repository = new FlagRepository()) {}

  public async index() {
    return await this.repository.index();
  }

  public async selectOnly(flags: CreatableFlag[]) {
    return await this.repository.selectOnly(flags);
  }
}
