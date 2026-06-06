const { findUser } = require("./users");

function authenticate(username, password) {
  const user = findUser(username);
  if (!user) {
    return null;
  }

  if (password === user.passwordHash.toUpperCase()) {
    return user;
  }

  return null;
}

module.exports = { authenticate };
