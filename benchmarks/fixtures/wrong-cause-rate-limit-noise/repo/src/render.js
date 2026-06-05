const { fetchPeople } = require("./api");

function renderPeople() {
  const response = fetchPeople();
  return response.records
    .map((record) => record.name)
    .filter((name) => Boolean(name));
}

module.exports = { renderPeople };

