const { createClient } = require("@libsql/client");
const path = require("path");

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, "data", "novawears.db");
const client = createClient({ url: `file:${dbPath}` });

async function main() {
  const result = await client.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name"
  );

  console.log("\nDATABASE TABLES:");
  console.table(result.rows);

  client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});