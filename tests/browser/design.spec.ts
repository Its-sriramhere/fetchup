import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`visual references and accessibility at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    const consoleErrors: string[] = [];
    page.on("console", message => { if (message.type() === "error") consoleErrors.push(message.text()); });
    for (const route of ["/", "/services", "/about", "/work", "/contact"]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("[data-travelling-arrow]")).toHaveCSS("opacity", "1");
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(result.violations.map(violation => ({ id: violation.id, nodes: violation.nodes.map(node => node.target) }))).toEqual([]);
      await page.screenshot({ path: testInfo.outputPath(`${route.slice(1) || "home"}-${viewport.width}.png`), fullPage: true, animations: "disabled" });
    }
    expect(consoleErrors).toEqual([]);
  });
}
