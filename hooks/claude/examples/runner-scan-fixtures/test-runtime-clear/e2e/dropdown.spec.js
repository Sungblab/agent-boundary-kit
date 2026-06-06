test("opens menu", async ({ page }) => {
  await page.getByRole("button", { name: "Menu" }).click();
});
