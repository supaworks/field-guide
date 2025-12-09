import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { env } from "$env/dynamic/private";
import { object, string } from "valibot";
import { valibotSchema } from "@ai-sdk/valibot";
import { SCHEMA_CONTEXT } from "./schema-context";

const openai = createOpenAI({
  apiKey: env.SUPA_API_TOKEN,
  baseURL: env.BASE_HREF
});

export const model = openai("qwen3-coder:30b");

export const SYSTEM_PROMPT = `
You are a PostGIS expert. Your goal is to convert natural language queries into SQL queries for a PostGIS database.

The database has a single table named "city_objects" with the following schema:
- id: serial primary key
- layer_name: text (The name of the dataset)
- properties: jsonb (Attributes of the object. Keys vary by layer.)
- geometry: geometry(Geometry, 4326)

${SCHEMA_CONTEXT}

Rules:
1. Always return a valid SQL query.
2. The query should select the GeoJSON representation of the geometry using ST_AsGeoJSON(geometry) as "geojson", and the properties column.
3. Example: SELECT properties, ST_AsGeoJSON(geometry) as geojson FROM city_objects WHERE layer_name = 'SK_Vegetationsmerkmal_f' LIMIT 10;
4. Use the "Dataset Definitions" above to identify the correct 'layer_name' and property keys (e.g., 'd_FKT', 'd_BWS') for the user's request.
5. CRITICAL: Do not guess column names. If the definition says 'd_BWF', use 'd_BWF'. Do not use 'd_FKT' unless listed for that layer.
6. CRITICAL: Use ILIKE with wildcards for text filtering to match partial strings. Example: properties->>'d_FKT' ILIKE '%Schwimmbad%'. Do not use = for text descriptions.
7. If the user asks for a specific location or spatial relationship, use PostGIS functions like ST_Contains, ST_DWithin, etc.
8. Do not include markdown formatting (sql) in the output, just the raw SQL.
9. CRITICAL: Only use tables names that are defined in the Dataset Definitions. There is no table called tree or bus_stops.
`;

export async function generateQuery(prompt: string) {
  try {
    const { object: result, request } = await generateObject({
      model,
      system: SYSTEM_PROMPT,
      prompt,
      schema: valibotSchema(
        object({
          sql: string(),
        })
      ),
    });
    console.log(JSON.stringify(request, null, 2))
    return result.sql;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate SQL query.");
  }
}
