import { $ } from "../database";

export default class ValidationHelper {
  public async unique(
    table: string,
    field: string,
    value: any
  ): Promise<boolean> {
    if (!(table in $)) {
      throw new Error(`${table} not exists in prisma`);
    }
    const model = ($ as any)[table];

    const existsRecord = await model.findFirst({
      where: { [field]: value },
    });

    await $.$disconnect();
    return !existsRecord;
  }
}
