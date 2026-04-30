import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: text().notNull().primaryKey(),
  account: text().notNull().unique(),
  password: text().notNull(),
  username: text().notNull(),
});
