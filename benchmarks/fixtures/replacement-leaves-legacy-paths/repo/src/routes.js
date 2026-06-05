const { renderSourceMap } = require("./source-map");
const { renderLegacyMindmap } = require("./legacy-mindmap");
const { renderLegacyGraph } = require("./legacy-graph");

const routes = [
  { path: "/map", label: "Source map", render: renderSourceMap },
  { path: "/mindmap", label: "Legacy mindmap", render: renderLegacyMindmap },
  { path: "/graph", label: "Knowledge graph", render: renderLegacyGraph },
];

function getRoutes() {
  return routes;
}

module.exports = { getRoutes };

