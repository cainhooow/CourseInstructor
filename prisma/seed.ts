import { PrismaClient } from "@prisma/client";

import { DefaultCategories } from "./seeds/DefaultCategories";
import { DefaultFlags } from "./seeds/DefaultFlags";
import { DefaultPlatformSettings } from "./seeds/DefaultPlatformSettings";

const prisma = new PrismaClient();
export type DefaultOmission = "id" | "created_at" | "updated_at";

async function main() {
  await prisma.category.deleteMany();
  await prisma.flag.deleteMany();
  await prisma.platformSetting.deleteMany();

  await prisma.category.createMany({
    data: DefaultCategories,
  });
  await prisma.flag.createMany({
    data: DefaultFlags(),
  });
  await prisma.platformSetting.createMany({
    data: DefaultPlatformSettings,
  });

  console.log("✅ Success!")
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
