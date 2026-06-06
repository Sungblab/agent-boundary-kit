const users = [
  { id: "u-1", username: "alice", passwordHash: "correct horse", role: "admin" },
  { id: "u-2", username: "bob", passwordHash: "battery staple", role: "member" },
];

function findUser(username) {
  return users.find((user) => user.username === username) || null;
}

module.exports = { findUser };
