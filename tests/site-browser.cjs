const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
let server;
let browser;
let baseUrl;

test.before(async () => {
  server = http.createServer((request, response) => {
    const requestPath = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const relativePath =
      requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
    const filePath = path.resolve(root, relativePath);
    if (!filePath.startsWith(root + path.sep)) {
      response.writeHead(403).end();
      return;
    }
    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(404).end();
        return;
      }
      const type = filePath.endsWith(".css")
        ? "text/css"
        : filePath.endsWith(".js")
          ? "text/javascript"
          : "text/html";
      response.writeHead(200, { "content-type": type });
      response.end(content);
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch();
});

test.after(async () => {
  if (browser) await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
});

test("applies the approved A2 visual foundation in a real browser", async () => {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 800 },
  });
  await page.goto(`${baseUrl}/tests/fixtures/shared.html`);
  const visual = await page.evaluate(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const shellStyle = getComputedStyle(document.querySelector(".site-shell"));
    const heroStyle = getComputedStyle(document.querySelector(".hero"));
    return {
      accent: rootStyle.getPropertyValue("--color-accent").trim(),
      shellBackground: shellStyle.backgroundColor,
      heroDisplay: heroStyle.display,
    };
  });
  assert.deepEqual(visual, {
    accent: "#8f1d22",
    shellBackground: "rgb(255, 255, 255)",
    heroDisplay: "grid",
  });
  await page.close();
});

test("keeps navigation visible when JavaScript is disabled", async () => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/tests/fixtures/shared.html`);
  assert.equal(
    await page
      .locator("[data-site-nav]")
      .evaluate((node) => getComputedStyle(node).display),
    "flex",
  );
  assert.equal(
    await page
      .locator("[data-menu-toggle]")
      .evaluate((node) => getComputedStyle(node).display),
    "none",
  );
  await context.close();
});

test("opens and closes the mobile menu with pointer and keyboard input", async () => {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  await page.goto(`${baseUrl}/tests/fixtures/shared.html`);
  const button = page.locator("[data-menu-toggle]");
  const nav = page.locator("[data-site-nav]");
  await button.click();
  assert.equal(await button.getAttribute("aria-expanded"), "true");
  assert.equal(await nav.getAttribute("data-open"), "true");
  await page.locator("[data-site-nav] a").first().click();
  assert.equal(await button.getAttribute("aria-expanded"), "false");
  await button.click();
  await page.keyboard.press("Escape");
  assert.equal(await button.getAttribute("aria-expanded"), "false");
  assert.equal(
    await button.evaluate((node) => node === document.activeElement),
    true,
  );
  assert.notEqual(
    await page.locator("[data-current-year]").textContent(),
    "1900",
  );
  await page.close();
});
