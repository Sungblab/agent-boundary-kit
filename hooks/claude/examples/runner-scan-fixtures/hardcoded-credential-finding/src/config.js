const defaultDatabaseUrl = "postgres://fixture:fixture@localhost:5432/boundary_kit";

function getDatabaseUrl() {
  return defaultDatabaseUrl;
}

module.exports = { getDatabaseUrl };
