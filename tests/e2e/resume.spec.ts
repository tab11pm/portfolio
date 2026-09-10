import { expect, test } from "@playwright/test";

const resumeUrl = process.env.RESUME_E2E_URL ?? "http://localhost:3000/resume";

test("presents one overlapping cyclic deck with a lift-and-drag interaction", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(resumeUrl);

  const deck = page.locator(".resume-deck");
  const cards = deck.locator(":scope > article");
  await expect(cards).toHaveCount(4);
  await expect(cards.first()).toHaveClass(/is-active/);

  const geometry = await cards.evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      return {
        height: (element as HTMLElement).offsetHeight,
        radius: styles.borderRadius,
        width: (element as HTMLElement).offsetWidth,
        x: box.x,
        zIndex: Number(styles.zIndex),
      };
    }),
  );

  expect(new Set(geometry.map(({ width }) => width)).size).toBe(1);
  expect(new Set(geometry.map(({ height }) => height)).size).toBe(1);
  expect(new Set(geometry.map(({ radius }) => radius)).size).toBe(1);
  expect(geometry[0].zIndex).toBeGreaterThan(Math.max(...geometry.slice(1).map(({ zIndex }) => zIndex)));
  expect(geometry.slice(1).every((card) => Math.abs(card.x - geometry[0].x) < geometry[0].width)).toBe(true);

  const activeCard = cards.first();
  const activeBox = await activeCard.boundingBox();
  if (!activeBox) throw new Error("Active résumé card is not visible");
  const initialTransform = await activeCard.evaluate((element) => getComputedStyle(element).transform);

  await page.mouse.move(activeBox.x + activeBox.width * 0.75, activeBox.y + activeBox.height * 0.25);
  await expect.poll(() => activeCard.evaluate((element) => getComputedStyle(element).transform)).not.toBe(initialTransform);

  await page.mouse.down();
  await page.mouse.move(activeBox.x - 180, activeBox.y + activeBox.height / 2, { steps: 10 });
  await page.mouse.up();
  await expect(cards.nth(1)).toHaveClass(/is-active/);
  expect(await deck.evaluate((element) => getComputedStyle(element, "::after").content)).toBe("none");

  await deck.press("ArrowLeft");
  await expect(cards.first()).toHaveClass(/is-active/);
  await deck.press("ArrowLeft");
  await expect(cards.nth(3)).toHaveClass(/is-active/);

  const lastCard = cards.nth(3);
  const lastBox = await lastCard.boundingBox();
  if (!lastBox) throw new Error("Cycled résumé card is not visible");
  await page.mouse.move(lastBox.x + lastBox.width * 0.75, lastBox.y + lastBox.height * 0.25);
  await expect.poll(() => lastCard.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  expect(await lastCard.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const points = [
      [box.left + 24, box.top + 24],
      [box.right - 24, box.top + 24],
      [box.left + 24, box.bottom - 24],
      [box.right - 24, box.bottom - 24],
    ];
    return points.every(([x, y]) => {
      const hit = document.elementFromPoint(x, y);
      return hit === element || (hit !== null && element.contains(hit));
    });
  })).toBe(true);

  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1440);
});

test("keeps the deck visible and still when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(resumeUrl);

  const cards = page.locator(".resume-deck > article");
  await expect(cards).toHaveCount(4);

  for (const card of await cards.all()) {
    await expect(card).toBeVisible();
    await expect(card).toHaveCSS("opacity", "1");
    await expect(card).toHaveCSS("transition-duration", "0s");
  }
});
