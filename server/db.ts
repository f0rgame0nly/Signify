import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

export const isDatabaseAvailable = !!process.env.DATABASE_URL;

if (!isDatabaseAvailable) {
  console.warn("WARNING: DATABASE_URL not set. Running without database — phrase storage will use in-memory fallback.");
}

const pool = isDatabaseAvailable
  ? new pg.Pool({ connectionString: process.env.DATABASE_URL })
  : (null as any);

export const db = isDatabaseAvailable
  ? drizzle(pool, { schema })
  : (null as any);
