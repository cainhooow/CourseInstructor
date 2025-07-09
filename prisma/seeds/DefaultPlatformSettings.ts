import { PlatformSetting } from "@prisma/client";
import { DefaultOmission } from "../seed";

export const DefaultPlatformSettings: Omit<PlatformSetting, DefaultOmission>[] =
  [
    {
      name: "ALLOW_CREATE_TEACHER_PROFILE",
      value: "true"
    },
    {
      name: "DEFAULT_COMISSION",
      value: "10.0",
    },
    {
      name: "DEFAULT_PAYOUT_THRESHOLD",
      value: "0.0",
    },
    {
      name: "ENABLE_GOOGLE_AUTH",
      value: "false",
    },
    {
      name: "ENABLE_DISCORD_AUTH",
      value: "false",
    },
    {
      name: "ENABLE_GITHUB_AUTH",
      value: "false",
    },
    {
      name: "AUTH_GITHUB_CLIENT_ID",
      value: "",
    },
    {
      name: "AUTH_GITHUB_CLIENT_SECRET",
      value: "",
    },
    {
      name: "AUTH_DISCORD_CLIENT_ID",
      value: "",
    },
    {
      name: "AUTH_DISCORD_CLIENT_SECRET",
      value: "",
    },
    {
      name: "AUTH_GOOGLE_CLIENT_ID",
      value: "",
    },
    {
      name: "AUTH_GOOGLE_CLIENT_SECRET",
      value: "",
    },
  ];
