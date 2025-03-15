import { FlagsDTO } from "../system/FlagsDTO";
import { UserPasswordDTO } from "./UserPasswordDTO";
import { UserProfileDTO } from "./UserProfileDTO";

export type UserDTO = {
  id: string;
  email: string;
  display_name: string;
  created_at: Date;
  updated_at: Date;
};

export type UserWithPasswordDto = UserDTO & {
  password: UserPasswordDTO;
};

export type UserWithProfileDTO = UserDTO & {
  profile: UserProfileDTO;
};

export type UserWithFlagsDTO = UserDTO & {
  flags: FlagsDTO[];
};