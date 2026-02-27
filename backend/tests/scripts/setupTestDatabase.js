import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../../src/config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.resolve(__dirname, "../../database.sql");

try {
  const sql = await fs.readFile(schemaPath, "utf8");
  await db.query(sql);
  console.log("Test database schema initialized.");
} catch (error) {
  console.error("Failed to initialize test database schema:", error);
  process.exitCode = 1;
} finally {
  await db.end();
}
