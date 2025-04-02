import prisma from "@prisma/client";
import Redis from "ioredis";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import Logger from "../utils/logger";

export const $ = new prisma.PrismaClient();
const redis = new Redis(1000, "localhost");

const cacheMiddleware: prisma.Prisma.Middleware = createPrismaRedisCache({
  models: [
    { model: "User", cacheTime: 180 },
    { model: "Flags", cacheTime: 180 },
    { model: "Course", cacheTime: 200 },
    { model: "RefreshToken", cacheTime: 90 },
  ],
  storage: {
    type: "redis",
    options: {
      client: redis as any,
      invalidation: {
        referencesTTL: 300,
      },
    },
  },
  cacheTime: 300,
  onHit: (key) => {
    Logger.log("DEBUG", `onHit: ${key}`);
  },
  onMiss: (key) => {
    Logger.log("DEBUG", `onMiss: ${key}`);
  },
  onError: (key) => {
    Logger.log("ERROR", `onError: ${key}`);
  },
});

export const { Prisma } = prisma;
$.$use(cacheMiddleware);
