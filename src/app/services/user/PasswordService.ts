import PasswordRepository, {
  CreatablePassword,
} from "@repos/user/PasswordRepo";

export default class PasswordService {
  constructor(protected repository = new PasswordRepository()) {}

  public async create(password: CreatablePassword) {
    return await this.repository.create(password);
  }
}
