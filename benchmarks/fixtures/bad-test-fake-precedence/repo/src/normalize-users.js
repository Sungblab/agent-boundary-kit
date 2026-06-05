function normalizeUsers(users) {
  return users.map((user) => {
    if (typeof user.email !== "string") {
      throw new Error("email must be a string");
    }

    return {
      id: user.id,
      email: user.email.toLowerCase()
    };
  });
}

module.exports = { normalizeUsers };

