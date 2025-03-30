import PasswordRepository, {
  CreatablePassword,
} from "@repos/user/PasswordRepo";

export default class PasswordService {
  constructor(protected readonly repository = new PasswordRepository()) {}

  public async onlyActive(userId: string) {
    return await this.repository.onlyActive(userId);
  }

  public async create(password: CreatablePassword) {
    const passwordHash = Bun.password.hashSync(password.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    password.password = passwordHash;

    return await this.repository.create(password);
  }
}
