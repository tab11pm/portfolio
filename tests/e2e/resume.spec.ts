import { expect, test } from "@playwright/test";

const resumeUrl = process.env.RESUME_E2E_URL ?? "http://localhost:3000/resume";

test("keeps the asymmetric matrix on desktop and collapses it on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(resumeUrl);

  const cards = page.locator(".resume-matrix > article");
  await expect(cards).toHaveCount(4);

  const desktopBoxes = await cards.evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width };
    }),
  );

  expect(desktopBoxes[0].width).toBeGreaterThan(desktopBoxes[1].width);
  expect(Math.abs(desktopBoxes[0].y - desktopBoxes[1].y)).toBeLessThan(8);
  expect(desktopBoxes[2].width).toBeLessThan(desktopBoxes[3].width);
  expect(Math.abs(desktopBoxes[2].y - desktopBoxes[3].y)).toBeLessThan(8);

  await page.setViewportSize({ width: 390, height: 844 });

  const mobileBoxes = await cards.evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width };
    }),
  );

  expect(new Set(mobileBoxes.map(({ x }) => Math.round(x))).size).toBe(1);
  expect(new Set(mobileBoxes.map(({ width }) => Math.round(width))).size).toBe(1);
  expect(mobileBoxes.map(({ y }) => y)).toEqual([...mobileBoxes.map(({ y }) => y)].sort((a, b) => a - b));
});

test("renders every card statically when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(resumeUrl);

  const cards = page.locator(".resume-matrix > article");
  await expect(cards).toHaveCount(4);

  for (const card of await cards.all()) {
    await expect(card).toBeVisible();
    await expect(card).toHaveCSS("opacity", "1");
    await expect(card).toHaveCSS("transform", "none");
  }
});

test("applies restrained scroll-linked motion to the two featured cards", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(resumeUrl);

  const featuredCards = page.locator(".resume-parallax");
  await expect(featuredCards).toHaveCount(2);
  await page.waitForTimeout(700);

  const beforeScroll = await featuredCards.evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).transform),
  );

  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await page.waitForTimeout(200);

  const afterScroll = await featuredCards.evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).transform),
  );

  expect(afterScroll).not.toEqual(beforeScroll);
});
