import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "../src/lib/server/db/schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

async function main() {
  console.log("Checking database content...");
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.cityObjects);
    console.log(`Found ${result[0].count} rows in city_objects.`);

    const layers = await db
      .select({
        layerName: schema.cityObjects.layerName,
        count: sql<number>`count(*)`,
      })
      .from(schema.cityObjects)
      .groupBy(schema.cityObjects.layerName);

    console.log("\nLayer counts:");
    layers.forEach((l) => console.log(`- ${l.layerName}: ${l.count}`));
  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await client.end();
  }
}

main();
