import { usersTable } from "../../db/schema";
import { hash } from "bcrypt-ts";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);

  if (!(username && password)) {
    throw createError({
      statusCode: 400,
      message:
        "Buth username and password must be provided in the request body",
    });
  }

  const db = useDrizzle();

  // Check if username already exists
  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));

  if (existingUser.length > 0) {
    throw createError({
      statusCode: 400,
      message: "Username already taken",
    });
  }

  const hashedPassword = await hash(password, 10);
  const insertResult = await db
    .insert(usersTable)
    .values({ username, password: hashedPassword })
    .returning({
      id: usersTable.id,
      username: usersTable.username,
      createdAt: usersTable.createdAt,
    });

  if (!insertResult || insertResult.length === 0) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create user",
    });
  }

  return {
    success: true,
    user: insertResult[0],
  };
});
