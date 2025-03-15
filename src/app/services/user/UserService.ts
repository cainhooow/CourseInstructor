import { UserDTO } from "@/app/dto/user/UserDTO";
import UserRepository from "@repos/user/UserRepo";
import FlagService from "../FlagService";

type CreatableUser = Omit<UserDTO, "id" | "created_at" | "updated_at">;

export default class UserService {
  constructor(
    protected repository = new UserRepository(),
    protected service = new FlagService()
  ) {}

  public async findById(id: string) {
    return await this.repository.includes(["Profile", "Flags"]).findById(id);
  }

  public async findByEmail(email: string) {
    return await this.repository
      .includes(["Profile", "Flags"])
      .findByEmail(email);
  }

  public async create(user: CreatableUser) {
    return await this.repository.create(user);
  }

  public async createWithFlags(user: CreatableUser) {
    const flags = await this.service.selectOnly([]);
    if (!flags) return;
    return await this.repository.createWithFlags(user, flags);
  }

  public async createWithPassword(user: CreatableUser, password: string) {
    const passwordHash = Bun.password.hashSync(password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    return await this.repository.createWithPassword(user, passwordHash);
  }

  public verifyPassoword(password: string, hash: string) {
    return Bun.password.verifySync(password, hash);
  }
}
