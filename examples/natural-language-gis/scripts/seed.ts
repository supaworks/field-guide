import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "../src/lib/server/db/schema";
import * as shp from "shpjs";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

console.log("DATA_DIR:", DATA_DIR);

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema });

async function main() {
  console.log("🚀 Starting seed process...");

  // Ensure PostGIS extension exists
  await client`CREATE EXTENSION IF NOT EXISTS postgis`;

  // Get all .shp files from the data directory
  const files = await fs.readdir(DATA_DIR);
  const shpFiles = files.filter((file) => file.endsWith(".shp"));

  for (const file of shpFiles) {
    const layerName = path.basename(file, ".shp");
    console.log(`\nProcessing layer: ${layerName}`);

    const shpPath = path.join(DATA_DIR, `${layerName}.shp`);
    const dbfPath = path.join(DATA_DIR, `${layerName}.dbf`);
    const prjPath = path.join(DATA_DIR, `${layerName}.prj`);

    try {
      // Check if DBF and PRJ exist
      await fs.access(dbfPath);
      await fs.access(prjPath);

      const [shpBuffer, dbfBuffer, prjBuffer] = await Promise.all([
        fs.readFile(shpPath),
        fs.readFile(dbfPath),
        fs.readFile(prjPath),
      ]);

      const prjString = prjBuffer.toString();

      // Parse SHP and DBF
      const geometries = shp.parseShp(shpBuffer, prjString);
      // @ts-expect-error - tbd.
      const properties = shp.parseDbf(dbfBuffer);

      // Combine to GeoJSON
      const geojson = shp.combine([geometries, properties]);

      const features = geojson.features;
      console.log(`  Found ${features.length} features.`);

      // Validate geometries
      for (let i = 0; i < features.length; i++) {
        const f = features[i];
        if (!f.geometry || typeof f.geometry !== "object") {
          console.error(`Invalid geometry at index ${i}:`, f.geometry);
        }
      }

      // Insert in chunks
      const chunkSize = 500;
      for (let i = 0; i < features.length; i += chunkSize) {
        const chunk = features.slice(i, i + chunkSize);

        const values = chunk.map((feature) => ({
          layerName: layerName,
          properties: feature.properties,
          // PostGIS/Drizzle expects the geometry object directly
          geom: sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(
            feature.geometry
          )}), 4326)`,
        }));

        await db.insert(schema.cityObjects).values(values);
        process.stdout.write(
          `\r  Inserted ${Math.min(i + chunkSize, features.length)} / ${
            features.length
          }`
        );
      }
      console.log("\n  ✅ Layer done.");
    } catch (err) {
      console.error(`❌ Failed to import layer ${layerName}:`, err);
    }
  }

  console.log("\n✅ Seed completed!");
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
