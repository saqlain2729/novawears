import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import path from "path";
import { mkdirSync } from "fs";
import * as schema from "./schema";

/**
 * Database connection.
 *
 * Uses libSQL (the SQLite-compatible engine behind Turso) instead of
 * better-sqlite3 so the exact same schema/query code works both:
 *  - locally, against a plain SQLite file on disk, and
 *  - in production on Vercel, against a remote Turso database over HTTP —
 *    Vercel's serverless functions have a read-only, ephemeral filesystem
 *    (aside from /tmp, which doesn't persist between invocations), so a
 *    local .db file cannot be used as the production database there.
 *
 * Local dev (no setup required): leave DATABASE_URL unset and it falls
 * back to a local file at DATABASE_PATH (./data/novawears.db by default).
 *
 * Production (required for Vercel): set DATABASE_URL to a Turso database
 * URL (libsql://...) and DATABASE_AUTH_TOKEN to its auth token. Create one
 * for free at https://turso.tech — see README for exact steps.
 */

function isBuildPhase(): boolean {
  // Next.js CLI sets NEXT_PHASE to "phase-production-build" only while it's
  // executing `next build`. At runtime inside a deployed serverless function
  // the variable is not set, so this keeps build-time imports happy while
  // still failing loudly at request time when credentials are missing.
  return process.env.NEXT_PHASE === "phase-production-build";
}

function buildClient(): Client {
  const remoteUrl = process.env.DATABASE_URL;

  if (remoteUrl) {
    return createClient({
      url: remoteUrl,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  }

  if (process.env.VERCEL) {
    if (isBuildPhase()) {
      // During `next build`, never crash because a runtime-only database
      // credential isn't available. Use an in-memory, empty SQLite client so
      // module imports and any pre-render default lookups succeed. At request
      // time (below) the app still fails loudly if DATABASE_URL is missing.
      console.warn(
        "DATABASE_URL is not set during build — using an empty in-memory SQLite " +
          "database. Set DATABASE_URL and DATABASE_AUTH_TOKEN as Vercel " +
          "environment variables for production."
      );
      return createClient({ url: "file::memory:" });
    }

    // Deployed to Vercel with no remote database configured. Fail loudly
    // and clearly instead of silently writing to an ephemeral /tmp file
    // that would lose all data on the next deploy or cold start.
    throw new Error(
      "DATABASE_URL is not set. On Vercel, DATABASE_URL (and DATABASE_AUTH_TOKEN) " +
        "must point at a remote libSQL/Turso database — a local SQLite file cannot " +
        "be used in production. See the README's Deployment section."
    );
  }

  // Local development fallback: a plain SQLite file on disk.
  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "novawears.db");
  mkdirSync(path.dirname(dbPath), { recursive: true });
  return createClient({ url: `file:${dbPath}` });
}

const globalForDb = globalThis as unknown as {
  libsqlClient?: Client;
};

const client = globalForDb.libsqlClient ?? buildClient();

if (!globalForDb.libsqlClient) {
  globalForDb.libsqlClient = client;
}

export const db = drizzle(client, { schema });
export { client };