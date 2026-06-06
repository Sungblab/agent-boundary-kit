test("opens menu", async ({ page }) => {
  await page.evaluate(() => window.menuOpen = true);
});
