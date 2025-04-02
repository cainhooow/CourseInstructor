import { UserProfileDTO } from "@/app/dto/user/user-profile.dto";
import { Response } from "../response";

export default class UserProfileResponse extends Response {
  constructor(protected readonly data: UserProfileDTO | UserProfileDTO[]) {
    super();
  }

  protected makeData(data: UserProfileDTO) {
    return {
      id: data.id,
      bio: data.bio,
      type: data.type,
      ...this.include,
    };
  }
}
