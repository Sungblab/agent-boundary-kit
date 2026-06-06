function routeForRequest(request) {
  if (request.type === "health") {
    return "health";
  }

  if (request.type === "research") {
    return "research";
  }

  return "unknown";
}

module.exports = { routeForRequest };
