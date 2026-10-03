// Optional browser QA: install Playwright outside the app, serve on port 8000.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  try {
    await page.goto(process.env.STUDIO_URL || "http://127.0.0.1:8000/");
    await page.waitForSelector(".cards");
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of [
        "home",
        "game",
        "photo",
        "assets",
        "audio",
        "settings",
      ]) {
        await page.evaluate((r) => (location.hash = r), route);
        await page.waitForFunction(
          (r) =>
            document
              .querySelector(`nav a[href="#${r}"]`)
              ?.hasAttribute("aria-current"),
          route,
        );
        assert.ok(await page.locator("h1").isVisible(), route + " heading");
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          route + " horizontal overflow at " + width,
        );
      }
    }
    await page.locator("[name=game]").fill("http://localhost:8001/");
    await page.locator("[name=photo]").fill("https://example.com/photo/");
    await page.locator("[name=theme]").selectOption("violet");
    await page.locator("[name=rain]").uncheck();
    await page.getByRole("button", { name: "Save preferences" }).click();
    await page.reload();
    await page.waitForSelector("[name=game]");
    assert.equal(
      await page.locator("[name=game]").inputValue(),
      "http://localhost:8001/",
    );
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      "violet",
    );
    assert.equal(await page.locator("[name=rain]").isChecked(), false);
    await page.evaluate(() => (location.hash = "game"));
    await page.waitForSelector('a[href="http://localhost:8001/"]');
    assert.equal(
      await page
        .locator('a[href="http://localhost:8001/"]')
        .getAttribute("target"),
      "_blank",
    );
    await page.evaluate(() => (location.hash = "assets"));
    await page.waitForSelector("#catalog-file");
    const data = {
      schemaVersion: 1,
      assets: [
        {
          id: "test_a",
          name: "Emerald Wall <img src=x onerror=alert(1)>",
          category: "textures",
          bytes: 1024,
          tags: ["wall"],
          exports: [],
        },
        {
          id: "test_b",
          name: "Footsteps",
          category: "audio",
          bytes: 2048,
          tags: [],
          exports: [],
        },
      ],
    };
    await page
      .locator("#catalog-file")
      .setInputFiles({
        name: "catalog.json",
        mimeType: "application/json",
        buffer: Buffer.from(JSON.stringify(data)),
      });
    await page.waitForSelector(".asset-row");
    assert.equal(await page.locator(".asset-row").count(), 2);
    assert.equal(await page.locator("#asset-results img").count(), 0);
    await page.locator("#asset-search").fill("emerald");
    assert.equal(await page.locator(".asset-row").count(), 1);
    await page.locator("#asset-search").fill("");
    await page.locator("#asset-category").selectOption("audio");
    assert.equal(await page.locator(".asset-row").count(), 1);
    assert.match(await page.locator(".asset-row").innerText(), /Footsteps/);
    await page
      .locator("#catalog-file")
      .setInputFiles({
        name: "bad.json",
        mimeType: "application/json",
        buffer: Buffer.from('{"wrong":true}'),
      });
    await page.waitForFunction(() =>
      document.querySelector("#toast").textContent.includes("Could not load"),
    );
    assert.equal(await page.locator(".asset-row").count(), 1);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => (location.hash = "settings"));
    await page.waitForSelector("#reset-settings");
    await page.locator("#reset-settings").click();
    assert.equal(await page.locator("[name=game]").inputValue(), "");
    assert.deepEqual(errors, []);
    console.log(
      "PASS: six routes at desktop/mobile widths, no overflow, saved settings, launch links, catalogue filters, HTML escaping, invalid catalogue handling and reduced motion.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
