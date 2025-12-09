import { json } from "@sveltejs/kit";
import { generateQuery } from "$lib/server/ai";

export const POST = async ({ request }) => {
  const { prompt } = await request.json();

  try {
    const sqlQuery = await generateQuery(prompt);
    console.log("Generated SQL:", sqlQuery);

    return json({
      query: sqlQuery,
    });
  } catch (error) {
    console.error("Error generating query:", error);
    return json({ error: "Failed to generate query" }, { status: 500 });
  }
};
