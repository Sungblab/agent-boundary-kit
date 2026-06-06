const { fetchPeople } = require("./api");

function renderPeople() {
  const response = fetchPeople();
  return response.records.map((record) => record.displayName).filter(Boolean);
}

module.exports = { renderPeople };
