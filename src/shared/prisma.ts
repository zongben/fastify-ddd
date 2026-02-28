import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client.js";

export type DbClient = ReturnType<typeof makePrisma>;

export const makePrisma = (deps: { url: string }) => {
  const { url } = deps;

  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
};
