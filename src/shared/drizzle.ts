import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../infra/db/schema.js";

export type DbClient = ReturnType<typeof makeDrizzle>;

export const makeDrizzle = (deps: { url: string }) => {
  const { url } = deps;

  const client = createClient({
    url,
  });
  return drizzle({ client, schema });
};
