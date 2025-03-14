import prisma from "@prisma/client";

export const $ = new prisma.PrismaClient();
export const { Prisma } = prisma;