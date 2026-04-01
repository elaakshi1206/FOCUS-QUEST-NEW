// @ts-nocheck – drizzle.config.ts is run by drizzle-kit (not tsc), so type-checking is skipped
import { defineConfig } from "drizzle-kit";
import fs from "fs";
import path from "path";

// ──────────────────────────────────────────────────────────────────────────────
// Auto-load lib/db/.env so you don't need to `export DATABASE_URL` in your
// shell. Just create lib/db/.env (copy from .env.example) and fill it in.
// ──────────────────────────────────────────────────────────────────────────────
const envFile = path.join(process.cwd(), ".env");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) return;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (key && !process.env[key]) process.env[key] = val;
    });
}

if (!process.env.DATABASE_URL) {
  console.error(
    "\n❌  DATABASE_URL is not set!\n" +
    "──────────────────────────────────────────────────\n" +
    "  1. Copy:  lib/db/.env.example  →  lib/db/.env\n" +
    "  2. Fill in your PostgreSQL connection string.\n" +
    "\n" +
    "  Free databases (no credit card required):\n" +
    "    • https://neon.tech   (serverless Postgres)\n" +
    "    • https://supabase.com\n" +
    "──────────────────────────────────────────────────\n"
  );
  process.exit(1);
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: false,
});
