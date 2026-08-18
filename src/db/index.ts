import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import { mkdirSync } from "fs";
import * as schema from "./schema";

const dbPath =
  process.env.DATABASE_PATH ||
  path.join(process.cwd(), "data", "novawears.db");

// Make sure the database directory exists
const dbDirectory = path.dirname(dbPath);
mkdirSync(dbDirectory, { recursive: true });

const globalForDb = globalThis as unknown as {
  sqlite?: Database.Database;
};

const sqlite =
  globalForDb.sqlite ??
  new Database(dbPath);

if (!globalForDb.sqlite) {
  globalForDb.sqlite = sqlite;
}

sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
export { sqlite };