// Test framework: Playwright
// Scope: E2E navigateur (vrai rendu UI + vraie navigation)
import { expect, test } from "@playwright/test";

test("displays login page", async ({ page }) => {
  // Navigation réelle vers la page de login
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Welcome back" })
  ).toBeVisible();
  await expect(page.getByText("OpenTaskHub", { exact: true })).toBeVisible();
});
