# Portfolio Shader Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static portfolio-project presentation with four readable cards that retain approved content while each runs its own provided `Warp` shader animation.

**Architecture:** `PortfolioPage` continues to own page-level heading content and passes the typed, approved `projects` array to a new client-side UI component. `FeaturesCards` maps that data once, pairs it by position with the first four original shader configurations, and conditionally renders external links from the existing `href` field.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4, `@paper-design/shaders-react`, Vitest and Testing Library.

## Global Constraints

- Show exactly Nadim, PinShop TJ, Moodle Math MCP, and SDO MCP, in the order from `data/projects.ts`.
- Preserve every existing project title, category, summary, technologies, `href`, and no-link state.
- Use the first four `Warp` configurations and their original parameters, including `speed={0.8}`. Replace the unsupported source pattern `dots` with the supported `stripes` for configurations two and four; this changes only the pattern drawing, not the animation.
- Do not add hover, click, entrance, or any other card animation.
- Place the client UI component at `/components/ui/feature-shader-cards.tsx`; this project already has TypeScript and Tailwind CSS, and the folder gives it the expected shadcn-compatible UI import path without introducing unused shadcn primitives.
- Shader animation is decorative: the project content and the dark readable overlay remain present independently of the rendered WebGL background.

---

## File Structure

```text
app/portfolio/page.tsx                         Page heading and typed project-data handoff
components/ui/feature-shader-cards.tsx          Client-only four-card Warp presentation
tests/components/feature-shader-cards.test.tsx  Mocked shader and content/link rendering contract
package.json                                    Adds the shader React package
package-lock.json                               Locks the installed dependency graph
app/globals.css                                 Removes unused former static-card selectors only
```

### Task 1: Add the shader package and lock the component contract

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `tests/components/feature-shader-cards.test.tsx`

**Interfaces:**
- Consumes: `projects` from `@/data/projects`.
- Produces: a regression contract for `FeaturesCards({ projects })`, one `Warp` per project, original animation speed, and correct conditional project links.

- [ ] **Step 1: Install the supplied rendering dependency**

Run:

```bash
npm install @paper-design/shaders-react
```

Expected: `package.json` lists `@paper-design/shaders-react` under `dependencies`, and `package-lock.json` contains its resolved transitive graph.

- [ ] **Step 2: Write the failing rendering-contract test**

Create `tests/components/feature-shader-cards.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { projects } from "@/data/projects";
import FeaturesCards, { ShaderErrorBoundary } from "@/components/ui/feature-shader-cards";

vi.mock("@paper-design/shaders-react", () => ({
  Warp: ({ speed, colors }: { speed: number; colors: string[] }) => (
    <div data-testid="warp" data-speed={speed} data-colors={colors.join(",")} />
  ),
}));

it("renders each approved project over its own continuously animated Warp", () => {
  render(<FeaturesCards projects={projects} />);

  const shaders = screen.getAllByTestId("warp");

  expect(screen.getAllByRole("article")).toHaveLength(4);
  expect(shaders).toHaveLength(4);
  expect(shaders.every((shader) => shader.dataset.speed === "0.8")).toBe(true);
  expect(new Set(shaders.map((shader) => shader.dataset.colors)).size).toBe(4);
  expect(screen.getByText("Nadim")).toBeInTheDocument();
  expect(screen.getByText("PinShop TJ")).toBeInTheDocument();
});

it("keeps external links limited to the two approved MCP projects", () => {
  render(<FeaturesCards projects={projects} />);

  expect(screen.queryByRole("link", { name: "Открыть проект Nadim" })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Открыть проект PinShop TJ" })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Открыть проект Moodle Math MCP" })).toHaveAttribute(
    "href",
    "https://github.com/tab11pm/moodle_math_mcp",
  );
  expect(screen.getByRole("link", { name: "Открыть проект SDO MCP" })).toHaveAttribute(
    "href",
    "https://github.com/tab11pm/sdo-mcp",
  );
});

it("keeps the project layer visible when a shader cannot render", () => {
  const BrokenShader = () => {
    throw new Error("WebGL unavailable");
  };

  render(
    <ShaderErrorBoundary>
      <BrokenShader />
    </ShaderErrorBoundary>,
  );

  expect(screen.getByTestId("shader-fallback")).toBeInTheDocument();
});
```

- [ ] **Step 3: Run the test to verify the missing-component failure**

Run:

```bash
npm run test -- tests/components/feature-shader-cards.test.tsx
```

Expected: FAIL because `@/components/ui/feature-shader-cards` does not exist yet.

- [ ] **Step 4: Commit the dependency and failing test**

```bash
git add package.json package-lock.json tests/components/feature-shader-cards.test.tsx
git commit -m "test: define shader portfolio card contract"
```

### Task 2: Implement the reusable four-project shader-card component

**Files:**
- Create: `components/ui/feature-shader-cards.tsx`
- Test: `tests/components/feature-shader-cards.test.tsx`

**Interfaces:**
- Consumes: `Project` and `projects` shape from `@/data/projects`; `Warp` from `@paper-design/shaders-react`.
- Produces: default `FeaturesCards({ projects }: { projects: readonly Project[] }): React.ReactElement`, with four semantic project articles and a decorative `Warp` inside each card.

- [ ] **Step 1: Define the component input and the four original shader configurations**

Start the file with the client boundary and imports:

```tsx
"use client";

import { Component, type ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { Warp } from "@paper-design/shaders-react";
import type { Project } from "@/data/projects";

type FeaturesCardsProps = {
  projects: readonly Project[];
};
```

Define and export a small error boundary before `FeaturesCards` so a rendering failure affects only the decorative layer:

```tsx
type ShaderErrorBoundaryProps = { children: ReactNode };
type ShaderErrorBoundaryState = { hasError: boolean };

export class ShaderErrorBoundary extends Component<ShaderErrorBoundaryProps, ShaderErrorBoundaryState> {
  state: ShaderErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ShaderErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? <div className="absolute inset-0 bg-[#15131a]" data-testid="shader-fallback" /> : this.props.children;
  }
}
```

Declare the four config objects in the same order and with the approved source values. The currently installed package exposes `checks`, `stripes`, and `edge` but not `dots`, so use approved `stripes` compatibility replacements in the second and fourth entries:

```tsx
const shaderConfigs = [
  { proportion: 0.3, softness: 0.8, distortion: 0.15, swirl: 0.6, swirlIterations: 8, shape: "checks" as const, shapeScale: 0.08, colors: ["hsl(280, 100%, 30%)", "hsl(320, 100%, 60%)", "hsl(340, 90%, 40%)", "hsl(300, 100%, 70%)"] },
  { proportion: 0.4, softness: 1.2, distortion: 0.2, swirl: 0.9, swirlIterations: 12, shape: "stripes" as const, shapeScale: 0.12, colors: ["hsl(200, 100%, 25%)", "hsl(180, 100%, 65%)", "hsl(160, 90%, 35%)", "hsl(190, 100%, 75%)"] },
  { proportion: 0.35, softness: 0.9, distortion: 0.18, swirl: 0.7, swirlIterations: 10, shape: "checks" as const, shapeScale: 0.1, colors: ["hsl(120, 100%, 25%)", "hsl(140, 100%, 60%)", "hsl(100, 90%, 30%)", "hsl(130, 100%, 70%)"] },
  { proportion: 0.45, softness: 1.1, distortion: 0.22, swirl: 0.8, swirlIterations: 15, shape: "stripes" as const, shapeScale: 0.09, colors: ["hsl(30, 100%, 35%)", "hsl(50, 100%, 65%)", "hsl(40, 90%, 40%)", "hsl(45, 100%, 75%)"] },
] as const;
```

- [ ] **Step 2: Render the accessible card grid over the shader backgrounds**

Implement the component as a Tailwind responsive grid. For each project, render an `<article>` with `relative min-h-80 overflow-hidden rounded-3xl`, a full-inset `aria-hidden="true"` `Warp` wrapper, and a relative dark `bg-black/80` content layer. Place `Warp` in `ShaderErrorBoundary` so a WebGL render failure is replaced only by the dark background layer. Pass every config property to `Warp`, plus the literal values `scale={1}`, `rotation={0}`, and `speed={0.8}`. Render the exact project `category`, `title`, `summary`, and `technologies.join(" · ")`.

Use this conditional link, preserving both the existing URL and its accessible name:

```tsx
{project.href ? (
  <a
    aria-label={`Открыть проект ${project.title}`}
    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gray-200"
    href={project.href}
    rel="noreferrer"
    target="_blank"
  >
    GitHub <ExternalLink aria-hidden="true" size={15} />
  </a>
) : null}
```

Do not add event handlers, CSS keyframes, transition classes, hover selectors, or entrance effects. The only motion is the continuously running `Warp` instance behind each article.

- [ ] **Step 3: Run the focused test to verify it passes**

Run:

```bash
npm run test -- tests/components/feature-shader-cards.test.tsx
```

Expected: PASS; four articles and four mocked `Warp` instances render, every instance receives speed `0.8` with a distinct source palette, shader failure leaves the fallback background visible, and only the two MCP URLs are links.

- [ ] **Step 4: Commit the reusable component**

```bash
git add components/ui/feature-shader-cards.tsx tests/components/feature-shader-cards.test.tsx
git commit -m "feat: add animated portfolio shader cards"
```

### Task 3: Integrate the component into the portfolio route and remove superseded styles

**Files:**
- Modify: `app/portfolio/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/components/feature-shader-cards.test.tsx`

**Interfaces:**
- Consumes: `FeaturesCards` default export and `projects` from the existing data module.
- Produces: `/portfolio` with its existing Russian eyebrow and H1 followed by the four-card animated project grid.

- [ ] **Step 1: Replace the route-local project map with the reusable component**

Replace the `ExternalLink` import in `app/portfolio/page.tsx` with:

```tsx
import FeaturesCards from "@/components/ui/feature-shader-cards";
import { projects } from "@/data/projects";
```

Keep the page wrapper, eyebrow, and exact H1 `Работы, за которыми стоит результат.`. Replace the old `<div className="project-grid">…</div>` expression with:

```tsx
<FeaturesCards projects={projects} />
```

- [ ] **Step 2: Remove only CSS made unused by the deleted static markup**

Delete the `.project-grid`, `.project`, `.project-pinshop`, `.project-moodle-math-mcp`, `.project-sdo-mcp`, `.category`, and `.project a` declarations from `app/globals.css`. Retain global tokens, page spacing, typography, responsive rules, focus styles, header/footer styles, and reduced-motion rule unchanged; the new component owns its grid and card styling through Tailwind classes.

- [ ] **Step 3: Run the full automated verification set**

Run:

```bash
npm run test
npm run lint
npm run build
```

Expected: all commands exit 0. The unit suite continues to assert only the four approved projects and correct MCP-only links; the production build accepts the client-only shader component.

- [ ] **Step 4: Perform visual smoke checks in a browser**

Run:

```bash
npm run dev
```

Verify at `/portfolio` on a wide desktop viewport and a narrow mobile viewport:

1. Exactly four cards appear in the original project order.
2. Every card has its own continuously changing `Warp` background, with readable dark overlay text.
3. There is no card lift, tilt, hover-only animation, or entrance animation.
4. Nadim and PinShop TJ have no external link; Moodle Math MCP and SDO MCP open their approved GitHub URLs.
5. The layout is three columns where space permits and collapses appropriately at narrower widths.

- [ ] **Step 5: Commit route integration and style cleanup**

```bash
git add app/portfolio/page.tsx app/globals.css
git commit -m "feat: integrate shader portfolio grid"
```

## Plan Self-Review

- Spec coverage: Tasks 1–2 add the supplied dependency, UI path, four source configurations, continuous `Warp` animation, readable overlay, semantic content, and conditional links. Task 3 integrates the route, retains responsive behavior, and verifies the complete route.
- Placeholder scan: no deferred work markers or unspecified test steps remain.
- Type consistency: `FeaturesCardsProps` accepts `readonly Project[]`, which matches the exported `projects` constant; the page and component use the same default-export name and import path. `ShaderErrorBoundary` is a named export used by its focused fallback test.
