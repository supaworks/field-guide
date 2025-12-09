import postgres from "postgres";

// Connect to the database
const sql = postgres("postgres://root:mysecretpassword@localhost:5433/local");

async function main() {
  console.log("Generating schema context...");

  // Get all layers
  const layers =
    await sql`SELECT DISTINCT layer_name FROM city_objects ORDER BY layer_name`;

  let contextOutput = "Dataset Definitions:\n";

  for (const { layer_name } of layers) {
    // 1. Get keys from a sample row to find the "type" column
    const sample =
      await sql`SELECT properties FROM city_objects WHERE layer_name = ${layer_name} LIMIT 1`;
    if (sample.length === 0) continue;

    const props = sample[0].properties;
    const keys = Object.keys(props);

    // Heuristic: Find the most descriptive column.
    // Usually starts with 'd_' (description) but ignore generic metadata like d_MAT (Material) or d_QAG (Quality)
    const typeKey =
      keys.find(
        (k) => k.startsWith("d_") && !["d_MAT", "d_QAG", "d_HER"].includes(k)
      ) || keys.find((k) => ["NAM", "BEZ", "ART", "FKT", "BWS"].includes(k));

    if (typeKey) {
      // 2. Get distinct values for this column (limit to 8 to save tokens)
      const values = await sql`
        SELECT DISTINCT properties->>${typeKey} as val 
        FROM city_objects 
        WHERE layer_name = ${layer_name} 
        AND properties->>${typeKey} IS NOT NULL
        LIMIT 8
      `;

      const valList = values.map((v) => `'${v.val}'`).join(", ");
      contextOutput += `- Layer: '${layer_name}' | Filter Column: '${typeKey}' | Sample Values: ${valList}\n`;
    } else {
      // Fallback if no obvious type column
      contextOutput += `- Layer: '${layer_name}' | No specific filter column found.\n`;
    }
  }

  console.log("\nCopy the following block into your SYSTEM_PROMPT:\n");
  console.log("--------------------------------------------------");
  console.log(contextOutput);
  console.log("--------------------------------------------------");

  await sql.end();
}

main();
