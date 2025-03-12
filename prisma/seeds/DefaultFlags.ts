import { Flag, FlagsType } from "@prisma/client";
import { DefaultOmission } from "../seed";

export const DefaultFlags: Omit<Flag, DefaultOmission>[] = [
  {
    name: FlagsType.CAN_POST_COURSE,
  },
  {
    name: FlagsType.CAN_EDIT_COURSE,
  },
  {
    name: FlagsType.CAN_ADD_MODERATORS,
  },
  {
    name: FlagsType.CAN_CREATE_CHAT,
  },
  {
    name: FlagsType.CAN_CREATE_PAID_COURSE,
  },
  {
    name: FlagsType.CAN_JOIN_A_COURSE,
  },
  {
    name: FlagsType.CAN_SEND_ATTACHMENTS,
  },
  {
    name: FlagsType.CAN_CREATE_CERTIFICATES,
  },
  {
    name: FlagsType.CAN_CREATE_ACTIVITIES,
  },
  {
    name: FlagsType.CAN_MODIFY_API_KEYS,
  },
  {
    name: FlagsType.CAN_MODIFY_TRANSACTION_PARAMETERS,
  },
  {
    name: FlagsType.CAN_MODIFY_PAYMENT_METHODS,
  },
  {
    name: FlagsType.CAN_MODIFY_USERS,
  },
  {
    name: FlagsType.CAN_MODIFY_PARTNERS,
  },
  {
    name: FlagsType.CAN_MODIFY_COUPONS,
  },
  {
    name: FlagsType.CAN_MODIFY_COURSES,
  },
  {
    name: FlagsType.CAN_MODIFY_CATEGORIES,
  },
  {
    name: FlagsType.CAN_MODIFY_USERS_ROLES,
  },
  {
    name: FlagsType.CAN_MODIFY_MESSAGES,
  },
];
