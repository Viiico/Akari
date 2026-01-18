import { usersTable } from "../../db/schema";
import { compare } from "bcrypt-ts";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);

  if (!(username && password)) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Buth username and password must be provided in the request body",
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
      statusMessage:
        "User with such username could not have been retrieved from the database",
    });
  }

  if (!(await compare(password, user.password))) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }

  return { success: true };
});