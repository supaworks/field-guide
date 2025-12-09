import { json } from "@sveltejs/kit";
import { generateQuery } from "$lib/server/ai";
import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";

export const POST = async ({ request }) => {
  const { prompt } = await request.json();

  try {
    const sqlQuery = await generateQuery(prompt);
    console.log("Generated SQL:", sqlQuery);

    // Execute the generated query
    // We use sql.raw() to execute the string returned by the LLM
    const result = await db.execute(sql.raw(sqlQuery));

    return json({
      query: sqlQuery,
      result,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return json({ error: "Failed to process request" }, { status: 500 });
  }
};
