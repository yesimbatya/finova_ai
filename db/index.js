import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const globalForDb = globalThis;

const conn = globalForDb.conn ?? neon(process.env.DATABASE_URL);
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });

console.log("Database connection string:", process.env.DATABASE_URL); // Debugging line
