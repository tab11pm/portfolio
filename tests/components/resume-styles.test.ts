import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const styles = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");

it("keeps the Core Matrix styles authoritative over the shared page shell", () => {
  expect(styles).not.toContain(".resume-grid");
  expect(styles).toContain(".page.resume-page");
  expect(styles).not.toContain("scroll-snap-type");
  expect(styles).toContain("perspective:1200px");
});
