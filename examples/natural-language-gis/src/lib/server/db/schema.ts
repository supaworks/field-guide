import { pgTable, serial, text, jsonb, customType } from "drizzle-orm/pg-core";

const geometry = customType<{ data: string }>({
  dataType() {
    return "geometry(Geometry, 4326)";
  },
});

export const cityObjects = pgTable("city_objects", {
  id: serial("id").primaryKey(),
  layerName: text("layer_name").notNull(),
  properties: jsonb("properties"), // Store all shapefile attributes here
  geom: geometry("geometry"), // Generic geometry type
});
