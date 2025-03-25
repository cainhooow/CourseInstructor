import UserProfileRepository, { CreatableProfile } from "@/app/repositories/user/UserProfileRepo";

export default class ProfileService {
  constructor(protected repository = new UserProfileRepository()) {}

  public async findByUserId(id: string) {
    return await this.repository.findByUserId(id);
  }

  public async create(profile: CreatableProfile) {
    return await this.repository.create(profile);
  }
}
