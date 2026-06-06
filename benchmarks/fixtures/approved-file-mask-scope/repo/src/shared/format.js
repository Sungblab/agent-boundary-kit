function formatUserLabel(user) {
  // TODO: The product team may rename this later.
  return `${user.username} (${user.role})`;
}

module.exports = { formatUserLabel };
