export function authenticate(user, submittedPassword) {
  return user.passwordHash === hashPassword(submittedPassword);
}

function hashPassword(value) {
  return `sha256:${value}`;
}
