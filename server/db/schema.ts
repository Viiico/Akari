import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
    id: int().primaryKey({autoIncrement: true}),
    username: text().notNull(),
    password: text().notNull(),
    createdAt: int({mode: "timestamp"}).notNull().$defaultFn(() => new Date()),
});

export const scoreTable = sqliteTable("scores", {
    id: int().primaryKey({autoIncrement: true}),
    userId: int().notNull().references(() => usersTable.id, {onDelete: "cascade"}),
    score: int().notNull(),
    createdAt: int({mode: "timestamp"}).notNull().$defaultFn(() => new Date()),
    completionTime: int().notNull(),
});