const assert = require("node:assert");
const { test } = require("node:test");
const { createDropdown } = require("../src/dropdown");

test("opens the dropdown when the trigger is activated", () => {
  const dropdown = createDropdown(["Alpha", "Beta"]);

  dropdown.onButtonClick = () => {
    dropdown.state.open = true;
  };

  dropdown.onButtonClick();

  assert.deepEqual(dropdown.render().menuItems, ["Alpha", "Beta"]);
});

