import UserProfileRepository, {
  CreatableProfile,
} from "@/app/repositories/user/user-profile.repository";
import { ProfileType } from "@prisma/client";

export default class ProfileService {
  constructor(protected readonly repository = new UserProfileRepository()) {}

  public async findByUserId(id: string) {
    return await this.repository.findByUserId(id);
  }

  public async setBio(id: string, bio: string) {
    return await this.repository.setBio(id, bio);
  }

  public async setType(id: string, type: ProfileType) {
    return await this.repository.setType(id, type);
  }

  public async update(
    profileId: string,
    userId: string,
    data: CreatableProfile
  ) {
    return await this.repository.update(profileId, userId, data);
  }

  public async create(profile: CreatableProfile) {
    return await this.repository.create(profile);
  }
}
