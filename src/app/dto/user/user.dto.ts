import { FlagsDTO } from "../system/flags.dto";
import { UserPasswordDTO } from "./user-password.dto";
import { UserProfileDTO } from "./user-profile.dto";

export type UserDTO = {
  id: string;
  email: string;
  display_name: string;
  created_at: Date;
  updated_at: Date;
};

export type UserWithPasswordDTO = UserDTO & {
  password: UserPasswordDTO;
};

export type UserWithProfileDTO = UserDTO & {
  Profile: UserProfileDTO;
};

export type UserWithFlagsDTO = UserDTO & {
  Flags: FlagsDTO[];
};
