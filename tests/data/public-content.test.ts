import { experience } from "@/data/experience";
import { projects } from "@/data/projects";

it("starts the public experience timeline with official work in 2024", () => {
  expect(experience[0]).toMatchObject({ period: "2024—2026", company: "Matrix IT" });
  expect(experience.some((item) => /2021|2022|2023/.test(item.period))).toBe(false);
});

it("exposes exactly the approved projects and only MCP repository links", () => {
  expect(projects.map((item) => item.slug)).toEqual(["nadim", "pinshop", "moodle-math-mcp", "sdo-mcp"]);
  expect(projects.find((item) => item.slug === "pinshop")?.href).toBeUndefined();
  expect(projects.filter((item) => item.href).map((item) => item.href)).toEqual([
    "https://github.com/tab11pm/moodle_math_mcp",
    "https://github.com/tab11pm/sdo-mcp",
  ]);
});
