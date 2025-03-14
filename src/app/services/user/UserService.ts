import { UserDTO } from "@/app/dto/user/UserDTO";
import UserRepository from "@repos/user/UserRepo";

type CreatableUser = Omit<UserDTO, "id" | "created_at" | "updated_at">;

export default class UserService {
  constructor(protected repository = new UserRepository()) {}

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
}
