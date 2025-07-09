import { PlatformSetting, Prisma } from "@prisma/client";
import Repository from "../repository";
import { $ } from "@/app/database";

export default class SettingsRepository extends Repository<
  PlatformSetting,
  Prisma.PlatformSettingFieldRefs
> {
  public async index() {
    const data = await $.platformSetting.findMany();
    return data as typeof data | null;
  }

  public async findByKey(key: string) {
    const data = await $.platformSetting.findFirstOrThrow({
      where: {
        name: key,
      },
    });

    return data as typeof data | null;
  }

  public async findByKeyAndValue(key: string, value: string) {
    const data = await $.platformSetting.findFirstOrThrow({
      where: {
        name: key,
        value,
      },
    });

    return data as typeof data | null;
  }

  public async findById(id: string) {
    const data = await $.platformSetting.findUnique({
      where: {
        id,
      },
    });

    return data as typeof data | null;
  }
}
