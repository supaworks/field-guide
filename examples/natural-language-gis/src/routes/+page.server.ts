import { db } from "$lib/server/db";
import { cityObjects } from "$lib/server/db/schema";
import { sql } from "drizzle-orm";

export const load = async () => {
  const layers = await db
    .select({ name: sql<string>`distinct ${cityObjects.layerName}` })
    .from(cityObjects);

  return {
    layers: layers.map((l) => l.name),
  };
};
