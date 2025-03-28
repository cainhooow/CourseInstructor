import prisma from "@prisma/client";
import Redis from "ioredis";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import Logger from "../utils/Logger";

export const $ = new prisma.PrismaClient();
export const { Prisma } = prisma;

const redis = new Redis(1000, "localhost");

const cacheMiddleware: prisma.Prisma.Middleware = createPrismaRedisCache({
  models: [
    { model: "User", cacheTime: 180 },
    { model: "Profile", cacheTime: 180 },
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
      log: Logger,
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

$.$use(cacheMiddleware);
