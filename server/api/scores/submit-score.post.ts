import { usersTable, scoreTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { username, score, completionTime } = await readBody(event);

  console.log(`Api recieved: ${username}, ${score}, ${completionTime}`);

  if (!username || score === undefined || completionTime === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Username, score, and completionTime are required",
    });
  }

  if (typeof score !== "number" || typeof completionTime !== "number") {
    throw createError({
      statusCode: 400,
      statusMessage: "Score and completionTime must be numbers",
    });
  }

  const db = useDrizzle();

  const user = db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1)
    .get();

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }

  const result = await db
    .insert(scoreTable)
    .values({ userId: user.id, score, completionTime })
    .returning({
      score: scoreTable.score,
      createdAt: scoreTable.createdAt,
      completionTime: scoreTable.completionTime,
    });

  if (!result || result.length === 0) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to submit score to database",
    });
  }

  const scoresWithUsernames = result.map((score) => ({
    username: user.username,
    ...score,
  }));

  return {
    success: true,
    scores: scoresWithUsernames,
  };
});
