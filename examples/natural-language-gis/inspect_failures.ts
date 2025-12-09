import postgres from "postgres";

const sql = postgres("postgres://root:mysecretpassword@localhost:5433/local");

async function main() {
  try {
    console.log("--- SK_SportFreizUErholgsflaeche_f (Leisure Areas) ---");
    const leisureTypes = await sql`
      SELECT DISTINCT properties->>'d_FKT' as val 
      FROM city_objects 
      WHERE layer_name = 'SK_SportFreizUErholgsflaeche_f' 
      ORDER BY val
    `;
    console.log(leisureTypes.map((r) => r.val));

    console.log("\n--- SK_BauwOAnlFSportFreizUErhol_f (Sports Facilities) ---");
    const sportTypes = await sql`
      SELECT DISTINCT properties->>'d_BWF' as val 
      FROM city_objects 
      WHERE layer_name = 'SK_BauwOAnlFSportFreizUErhol_f' 
      ORDER BY val
    `;
    console.log(sportTypes.map((r) => r.val));
  } catch (error) {
    console.error(error);
  } finally {
    await sql.end();
  }
}

main();
