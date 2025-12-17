import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client.js";

export type DbClient = ReturnType<typeof makePrisma>;

export const makePrisma = (url: string) => {
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
};
