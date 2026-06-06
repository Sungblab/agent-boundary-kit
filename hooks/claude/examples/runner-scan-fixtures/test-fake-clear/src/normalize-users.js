function normalizeUsers(users) {
  return users.map((user) => ({
    id: user.id,
    email: user.email.toLowerCase()
  }));
}

module.exports = { normalizeUsers };
