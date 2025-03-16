import {
  UserDTO,
  UserWithFlagsDTO,
  UserWithProfileDTO,
} from "@/app/dto/user/UserDTO";
import { Response } from "../Response";

export default class UserResponse extends Response {
  constructor(data: UserDTO) {
    super(data);
    this.incremental(data);
  }

  private incremental(data: UserDTO | UserWithFlagsDTO | UserWithProfileDTO) {
    if ("Profile" in data && data.Profile !== null) {
      this.addField("profile", data.Profile);
    }

    if ("Flags" in data && (data as UserWithFlagsDTO).Flags.length > 0) {
      this.addField("flags", data.Flags);
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
