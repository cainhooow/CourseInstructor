import {
  UserDTO,
  UserWithFlagsDTO,
  UserWithProfileDTO,
} from "@/app/dto/user/user.dto";
import { Response } from "../response";

export default class UserResponse extends Response {
  constructor(protected readonly data: UserDTO) {
    super(data);
    this.incremental(data);
  }

  private incremental(data: UserDTO | UserWithFlagsDTO | UserWithProfileDTO) {
    if ("Profile" in data && data.Profile !== null) {
      this.addField("profile", {
        bio: data.Profile.bio,
        type: data.Profile.type,
      });
    }

    if ("Flags" in data && (data as UserWithFlagsDTO).Flags.length > 0) {
      this.addField(
        "flags",
        data.Flags.map((flag) => flag.name)
      );
    }
  }

  protected makeData(data: UserDTO | UserWithFlagsDTO | UserWithProfileDTO) {
    return {
      id: data.id,
      email: data.email,
      name: data.display_name,
      ...this.include,
    };
  }
}
