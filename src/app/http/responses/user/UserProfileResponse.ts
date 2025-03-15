import { UserProfileDTO } from "@/app/dto/user/UserProfileDTO";
import { Response } from "../Response";

export default class UserProfileResponse extends Response {
  constructor(protected data: UserProfileDTO | UserProfileDTO[]) {
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
