import { scoreTable, usersTable } from "../../db/schema";
import { useDrizzle } from "../../utils/drizzle";
import { desc, eq, gte } from "drizzle-orm";
import { LeaderBoardPeriods as LeaderboardPeriodsType } from "../../../app/lib/Types/Generic";

export default defineEventHandler(async (event) => {
  const db = useDrizzle();

  const query = getQuery(event);
  const period =
    (query.type as LeaderboardPeriodsType) || LeaderboardPeriodsType.ALL_TIME;

    let dateFilter = new Date(0);

  switch (period) {
    case LeaderboardPeriodsType.DAILY: {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      dateFilter = yesterday;
      break;
    }

    case LeaderboardPeriodsType.WEEKLY: {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      dateFilter = lastWeek;
      break;
    }

    case LeaderboardPeriodsType.ALL_TIME: {
      // No date filter
      break;
    }
  }

  let baseQuery = db
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
    .where(gte(scoreTable.createdAt, dateFilter));

  const scores = await baseQuery.orderBy(desc(scoreTable.score)).all();

  return {
    scores,
    period,
    totalCount: scores.length,
  };
});
