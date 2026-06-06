function getDatabaseUrl(env = process.env) {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  return env.DATABASE_URL;
}

module.exports = { getDatabaseUrl };
