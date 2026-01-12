import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const fruitsTable = sqliteTable("fruits", {
    id: int().primaryKey({autoIncrement: true}),
    name: text().notNull(),
});

export const usersTable = sqliteTable("users", {
    id: int().primaryKey({autoIncrement: true}),
    username: text().notNull(),
    password: text().notNull(),
    createdAt: int({mode: "timestamp"}).notNull().$defaultFn(() => new Date()),
})