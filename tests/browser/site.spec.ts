import { expect, test } from "@playwright/test";

const routes = ["/", "/services", "/about", "/work", "/contact"];

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`all pages fit ${width}px and load without browser errors`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("[data-travelling-arrow]")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      expect(await page.locator(".brand img").first().evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test("arrow follows scroll, reverses, stays still when scrolling stops and survives navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const arrow = page.locator("[data-travelling-arrow]");
  await expect(arrow).toHaveCSS("opacity", "1");
  await arrow.evaluate(element => element.setAttribute("data-instance", "original"));
  const pose = () => arrow.evaluate(element => getComputedStyle(element).transform);
  const initial = await pose();
  await page.evaluate(() => window.scrollTo(0, 1300));
  await expect.poll(pose).not.toBe(initial);
  const middle = await pose();
  await page.waitForTimeout(350);
  expect(await pose()).toBe(middle);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(pose).toBe(initial);
  await page.getByRole("navigation", { name: "Main navigation", exact: true }).getByRole("link", { name: "Services", exact: true }).click();
  await expect(page).toHaveURL("/services");
  await expect(arrow).toHaveAttribute("data-instance", "original");
  await expect(arrow).toHaveCount(1);
  await page.goBack();
  await expect(page).toHaveURL("/");
  await expect(arrow).toHaveAttribute("data-instance", "original");
  await page.evaluate(() => window.scrollTo(0, 1700));
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(async () => { const box = await arrow.boundingBox(); return box && box.x >= 0 && box.x + box.width <= 391; }).toBeTruthy();
});

test("motion preference is persisted and disables scroll-driven movement", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  await expect(page.getByRole("button", { name: "Motion paused", exact: true })).toHaveAttribute("aria-pressed", "true");
  const pose = await page.locator("[data-travelling-arrow]").getAttribute("style");
  await page.evaluate(() => window.scrollTo(0, 1400));
  await page.waitForTimeout(100);
  expect(await page.locator("[data-travelling-arrow]").getAttribute("style")).toBe(pose);
  await page.reload();
  await expect(page.getByRole("button", { name: "Motion paused", exact: true })).toBeVisible();
});

test("system reduced motion leaves a static arrow and no WebGL background", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Reduced motion" })).toBeDisabled();
  await expect(page.locator(".aurora-canvas")).toHaveCount(0);
});

test("mobile menu supports keyboard dismissal and route navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  await menu.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(menu).toBeFocused();
  await menu.click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL("/work");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("form validates, preserves input on delivery failure and preselects service", async ({ page }) => {
  await page.goto("/contact?service=web-development#enquiry");
  await expect(page.getByText("Let’s talk about:")).toContainText("Web development");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("Please enter your full name.")).toBeVisible();
  await page.getByLabel("Your name").fill("Alex Taylor");
  await page.getByLabel("Work email").fill("alex@example.com");
  await page.getByLabel("What would you like to build?").fill("We would like a new booking experience for our business.");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator(".enquiry-form [role='alert']")).toContainText("being set up");
  await expect(page.getByLabel("Your name")).toHaveValue("Alex Taylor");
  await expect(page.getByText("Thanks for getting in touch.")).toHaveCount(0);
});

test("accepted server response shows an accessible enquiry confirmation", async ({ page }) => {
  await page.route("**/api/enquiry", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ accepted: true }) }));
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Alex Taylor");
  await page.getByLabel("Work email").fill("alex@example.com");
  await page.getByLabel("What would you like to build?").fill("We would like a new booking experience for our business.");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("Thanks for getting in touch.");
  await expect(page.getByRole("status")).toBeFocused();
});

test("server rejects malformed, invalid and cross-origin enquiries", async ({ request }) => {
  expect((await request.post("/api/enquiry", { data: { name: "" } })).status()).toBe(400);
  expect((await request.post("/api/enquiry", { data: {}, headers: { origin: "https://unrelated.example" } })).status()).toBe(403);
  expect((await request.post("/api/enquiry", { data: "x".repeat(21000), headers: { "content-type": "application/json" } })).status()).toBe(413);
});
