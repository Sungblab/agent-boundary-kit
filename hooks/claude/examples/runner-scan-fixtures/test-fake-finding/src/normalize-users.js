function normalizeUsers(users) {
  return users.map((user) => ({
    id: user.id,
    email: user.contact.email
  }));
}

module.exports = { normalizeUsers };
