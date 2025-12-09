import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";

export const POST = async ({ request }) => {
  const { query } = await request.json();

  if (!query) {
    return json({ error: "Query is required" }, { status: 400 });
  }

  // SECURITY WARNING: In a production environment, you must validate or sign this query
  // to prevent arbitrary SQL execution from the client.
  // For this demo, we assume the client is trusted or the environment is isolated.

  try {
    // Execute the raw SQL query
    const result = await db.execute(sql.raw(query));

    return json({
      result,
    });
  } catch (error) {
    console.error("Error executing query:", error);
    return json({ error: "Failed to execute query" }, { status: 500 });
  }
};
