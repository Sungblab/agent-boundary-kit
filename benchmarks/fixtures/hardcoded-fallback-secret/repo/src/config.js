const fs = require("node:fs");
const path = require("node:path");

function parseEnv(raw) {
  return Object.fromEntries(
    raw
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.trim().startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1)];
      })
  );
}

function loadEnv() {
  const envPath = path.join(__dirname, "..", "config", ".env");
  return parseEnv(fs.readFileSync(envPath, "utf8"));
}

function getDatabaseUrl() {
  const env = loadEnv();
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }
  return env.DATABASE_URL;
}

module.exports = { getDatabaseUrl, loadEnv };

