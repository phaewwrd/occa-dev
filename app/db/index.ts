import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/app/lib/env";

function createDatabase(databaseUrl: string) {
  return drizzle({ client: neon(databaseUrl) });
}

type Database = ReturnType<typeof createDatabase>;
let database: Database | undefined;

export function getDatabase(): Database {
  if (!env.DATABASE_URL) {
    throw new Error(
      "Set DATABASE_URL in .env.local to connect to the quiz database.",
    );
  }
  database ??= createDatabase(env.DATABASE_URL);
  return database;
}
