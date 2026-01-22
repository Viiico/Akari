import { scoreTable, usersTable } from "../db/schema";
import { useDrizzle } from "../utils/drizzle";
import { desc, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = useDrizzle();
  
  const scores = await db
    .select({
      id: scoreTable.id,
      userId: scoreTable.userId,
      username: usersTable.username,
      score: scoreTable.score,
      createdAt: scoreTable.createdAt,
      completionTime: scoreTable.completionTime,
    })
    .from(scoreTable)
    .leftJoin(usersTable, eq(scoreTable.userId, usersTable.id))
    .orderBy(desc(scoreTable.score))
    .all();

  return {
    scores,
  };
});