import { UserDTO } from "@/app/dto/user/UserDTO";
import { Response } from "../Response";

export default class UserResponse extends Response {
  constructor(data: UserDTO | UserDTO[]) {
    super(data);
  }

  protected makeData(data: UserDTO) {
    return {
      id: data.id,
      email: data.email,
      name: data.display_name,
      ...this.include,
    };
  }
}
