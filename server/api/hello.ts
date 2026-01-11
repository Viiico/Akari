import { fruitsTable } from "../db/schema";
import { useDrizzle } from "../utils/drizzle";

export default defineEventHandler(async (event) => {
  const fruits = useDrizzle().select().from(fruitsTable).all();

  return {
    fruits,
  };
});
