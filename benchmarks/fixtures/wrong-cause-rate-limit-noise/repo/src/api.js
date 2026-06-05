function fetchPeople() {
  return {
    status: 200,
    records: [
      { id: "p1", displayName: "Ada Lovelace" },
      { id: "p2", displayName: "Grace Hopper" }
    ]
  };
}

module.exports = { fetchPeople };

