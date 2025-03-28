import { UserAddressDTO } from "./UserAddressDTO";

export type UserBillingDTO = {
  id: string;
  name: string;
  document: string;
  userId: string;
  addressId: string;
  created_at: Date;
  updated_at: Date;
};

export type BillingDTOWithAddress = UserBillingDTO & {
  addressId: number;
  address: UserAddressDTO;
};
