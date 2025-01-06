const { test, expect } = require("@playwright/test");

test.describe("Login and Profile Navigation", () => {
	test("Login and navigate to user profile", async ({ page }) => {
		await page.goto("http://localhost:3000/public/user/signin");

		await page.fill(
			'input[name="username"]',
			"spt51819@kisoq.com"
		);
		await page.fill('input[name="password"]', "admin1");

		await page.click('button[type="submit"]');

		await page.click("text=Profile");
		await expect(page).toHaveURL(
			"http://localhost:3000/protected/user/profile"
		);

		await expect(page.locator("h2")).toContainText(
			"Edytuj profil"
		);
	});

	test("Redirect unauthorized user to login page", async ({ page }) => {
		await page.goto("http://localhost:3000/public/user/signin");

		await expect(page).toHaveURL(
			"http://localhost:3000/public/user/signin"
		);

		await expect(page.locator("h2")).toContainText("Sign In");
	});
});
