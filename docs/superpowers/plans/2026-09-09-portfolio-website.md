# Personal Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a Russian three-page Next.js personal portfolio with the approved Midnight Editorial design, current public experience from 2024 onward, and four selected projects.

**Architecture:** Use Next.js App Router with static route components and type-safe local content modules. Shared shell and section components keep each page focused; decorative client-side canvases are scheduled through a single backdrop coordinator, while all textual content remains server-rendered and usable without JavaScript.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Lucide React, Vitest + Testing Library, Playwright, Vercel.

## Global Constraints

- Publish Russian content only; do not add locale routing or translation dependencies.
- Public work history starts at 2024; no public copy may reference 2021–2023 employment.
- PinShop TJ remains described as in testing, with no public launch/metric claims and no external card link.
- Portfolio contains exactly Nadim, PinShop TJ, Moodle Math MCP, and SDO MCP; no Smart Marketplace, Black Grill, or Telegram MCP.
- Moodle Math MCP links to `https://github.com/tab11pm/moodle_math_mcp`; SDO MCP links to `https://github.com/tab11pm/sdo-mcp`.
- Reuse/adapt the animation architecture from `/mnt/D/life/portfolio`: one active heavy canvas, paused off-screen/hidden, and full `prefers-reduced-motion` support.
- Keep contact values out of committed source: read public contact handles from `NEXT_PUBLIC_*` environment variables and document their names in `.env.example`.
- Do not use stock photographs. Use existing project graphics where applicable and CSS/SVG editorial illustration for new visual treatment.

---

## File Structure

```text
app/
  layout.tsx                         Root metadata, font loading, global shell
  page.tsx                           Home route
  resume/page.tsx                    Resume route
  portfolio/page.tsx                 Portfolio route
  sitemap.ts                         Absolute URL sitemap from site URL
  globals.css                        Midnight Editorial tokens, responsive layout, motion rules
components/
  layout/{Header,Footer,Container}.tsx
  sections/{HomeHero,ExperienceTimeline,ResumeSummary,PortfolioGrid,ContactBlock}.tsx
  portfolio/ProjectCard.tsx
  motion/{BackdropProvider,PixelCanvas,DotMatrix,WarpField,Reveal}.tsx
data/{profile,experience,projects,skills,contacts}.ts
lib/{env,cn}.ts
public/images/                        Approved legacy project graphics copied here
tests/{data,components}/              Unit and rendering tests
tests/e2e/portfolio.spec.ts           Browser checks for all routes and public links
```

### Task 1: Bootstrap the testable Next.js application

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`, `.env.example`, `.gitignore`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `app/sitemap.ts`
- Create: `tests/components/root-shell.test.tsx`, `tests/e2e/portfolio.spec.ts`

**Interfaces:**
- Produces `npm run dev`, `npm run lint`, `npm run test`, `npm run build`, and `npm run test:e2e` scripts.
- Produces root layout rendering `Header`, route content, and `Footer`; Task 3 supplies those imports.

- [ ] **Step 1: Create the dependency manifest and scripts**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "lucide-react": "^1.39.0",
    "next": "16.2.9",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  }
}
```

- [ ] **Step 2: Add the failing root-shell test**

```tsx
import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

it("renders landmark shell around child content", () => {
  render(<RootLayout><p>Страница</p></RootLayout>);
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByRole("main")).toHaveTextContent("Страница");
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm install && npm run test -- tests/components/root-shell.test.tsx`  
Expected: FAIL because `app/layout.tsx` and shell components do not exist.

- [ ] **Step 4: Implement baseline configuration and root route**

Create App Router TypeScript configuration, Tailwind v4 PostCSS setup, Vitest alias `@ -> .`, and a root layout with Russian `<html lang="ru">`. Make `app/page.tsx` render a temporary semantic `<h1>Табрез Шонизоров</h1>` only until Task 4 replaces it. Add `.gitignore` entries for `node_modules/`, `.next/`, `.env*` except `.env.example`, `playwright-report/`, `test-results/`, and `.superpowers/`.

- [ ] **Step 5: Make the baseline test pass and add route smoke test**

```ts
import { test, expect } from "@playwright/test";

test("home route has the Russian document title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Табрез Шонизоров/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
```

Run: `npm run test && npm run lint && npm run build`  
Expected: all commands exit 0.

- [ ] **Step 6: Commit the bootstrap**

Run after repository initialization: `git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs vitest.config.ts vitest.setup.ts playwright.config.ts .env.example .gitignore app tests && git commit -m "feat: bootstrap portfolio app"`

### Task 2: Define validated public content and environment contracts

**Files:**
- Create: `data/profile.ts`, `data/experience.ts`, `data/projects.ts`, `data/skills.ts`, `data/contacts.ts`, `lib/env.ts`
- Create: `tests/data/experience.test.ts`, `tests/data/projects.test.ts`, `tests/data/contacts.test.ts`
- Modify: `.env.example`

**Interfaces:**
- Produces `profile`, `experience`, `skills`, `projects`, and `contacts` typed constants consumed by Tasks 3–5.
- `Project` is `{ slug: "nadim" | "pinshop" | "moodle-math-mcp" | "sdo-mcp"; title: string; category: string; summary: string; technologies: readonly string[]; href?: string }`.
- `readPublicEnv()` returns `{ siteUrl: string; telegramUser: string; githubUser: string; email: string }`.

- [ ] **Step 1: Write failing data-contract tests**

```ts
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";

it("starts public work history in 2024", () => {
  expect(experience.map((item) => item.period)).not.toContain("2021");
  expect(experience[0]).toMatchObject({ period: "2024—2026", company: "Matrix IT" });
});

it("publishes only four approved projects and links only MCP cards", () => {
  expect(projects.map((item) => item.slug)).toEqual(["nadim", "pinshop", "moodle-math-mcp", "sdo-mcp"]);
  expect(projects.find((item) => item.slug === "pinshop")?.href).toBeUndefined();
  expect(projects.filter((item) => item.href).map((item) => item.href)).toEqual([
    "https://github.com/tab11pm/moodle_math_mcp",
    "https://github.com/tab11pm/sdo-mcp",
  ]);
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- tests/data/experience.test.ts tests/data/projects.test.ts`  
Expected: FAIL because the data modules do not exist.

- [ ] **Step 3: Implement explicit, approved content objects**

Encode the exact Matrix IT (2024–2026), TUSUR (2024–2028), and PinShop TJ (2026—сейчас, project in testing) records. Create the four project cards with approved copy: Nadim frontend/CRM/POS work; PinShop TJ localised China-shopping product in testing; Moodle Math MCP Playwright Moodle automation; SDO MCP local SDO TUSUR Playwright automation. Do not include an `href` for Nadim or PinShop.

- [ ] **Step 4: Implement public environment reader and template**

```ts
export function readPublicEnv() {
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    telegramUser: process.env.NEXT_PUBLIC_TELEGRAM_USER ?? "",
    githubUser: process.env.NEXT_PUBLIC_GITHUB_USER ?? "tab11pm",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  };
}
```

Document exactly these four variables in `.env.example`; validation must omit a link when a value is empty, rather than render `MISSING_*` or a dead URL.

- [ ] **Step 5: Run data checks**

Run: `npm run test -- tests/data && npm run lint`  
Expected: all data assertions pass and no public copy contains `2021`, `2022`, `2023`, `Smart Marketplace`, `Black Grill`, or `Telegram MCP`.

- [ ] **Step 6: Commit the content layer**

Run: `git add data lib/env.ts .env.example tests/data && git commit -m "feat: add approved portfolio content"`

### Task 3: Build the shared Midnight Editorial shell and accessible primitives

**Files:**
- Create: `components/layout/Header.tsx`, `components/layout/Footer.tsx`, `components/layout/Container.tsx`, `components/sections/Section.tsx`, `components/sections/ContactBlock.tsx`, `lib/cn.ts`
- Create: `tests/components/header.test.tsx`, `tests/components/contact-block.test.tsx`
- Modify: `app/layout.tsx`, `app/globals.css`

**Interfaces:**
- `Header` renders navigation links `{ href: "/", label: "Главная" }`, `{ href: "/resume", label: "Резюме" }`, `{ href: "/portfolio", label: "Портфолио" }`.
- `Section({ id, eyebrow?, title, children, className? })` renders semantic section and H2.
- `ContactBlock({ compact?: boolean })` consumes `contacts` and emits only present contact anchors.

- [ ] **Step 1: Write failing component tests**

```tsx
it("offers all three site routes", () => {
  render(<Header />);
  expect(screen.getByRole("link", { name: "Главная" })).toHaveAttribute("href", "/");
  expect(screen.getByRole("link", { name: "Резюме" })).toHaveAttribute("href", "/resume");
  expect(screen.getByRole("link", { name: "Портфолио" })).toHaveAttribute("href", "/portfolio");
});
```

- [ ] **Step 2: Run the tests to verify failure**

Run: `npm run test -- tests/components/header.test.tsx tests/components/contact-block.test.tsx`  
Expected: FAIL because shared components do not exist.

- [ ] **Step 3: Implement the shell, semantics, and responsive behaviour**

Implement a `header`/`nav`/`main`/`footer` landmark structure. On narrow screens, use a button with `aria-expanded` and `aria-controls` to reveal the same three route links; close it on link activation and Escape. Use `lucide-react` only for labelled external-link, menu, close, mail, GitHub, and Telegram icons. Define global palette tokens `--bg: #0d0d0f`, `--surface: #101014`, `--text: #f4f0e9`, `--muted: #b8b2bf`, `--accent: #9b8cff`; include visible `:focus-visible` and responsive typography rules.

- [ ] **Step 4: Make the tests pass and verify keyboard navigation**

Run: `npm run test -- tests/components/header.test.tsx tests/components/contact-block.test.tsx && npm run lint`  
Expected: PASS. In the browser, Tab reaches every nav/contact link and Escape closes the mobile menu.

- [ ] **Step 5: Commit the shared shell**

Run: `git add app/layout.tsx app/globals.css components/layout components/sections/Section.tsx components/sections/ContactBlock.tsx lib/cn.ts tests/components && git commit -m "feat: add portfolio shell and navigation"`

### Task 4: Implement the home and resume routes

**Files:**
- Create: `components/sections/HomeHero.tsx`, `components/sections/ExperienceTimeline.tsx`, `components/sections/ResumeSummary.tsx`
- Create: `app/resume/page.tsx`, `tests/components/experience-timeline.test.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- `HomeHero()` renders the single H1, two CTA links, and decorative illustration marked `aria-hidden`.
- `ExperienceTimeline({ entries: ExperienceEntry[] })` renders one list item per record with `time` element.
- `ResumeSummary()` renders experience, education, skills, achievements, and `ContactBlock`.

- [ ] **Step 1: Write failing route-content tests**

```tsx
it("renders only the approved official timeline", () => {
  render(<ExperienceTimeline entries={experience} />);
  expect(screen.getByText("Matrix IT")).toBeInTheDocument();
  expect(screen.getByText("PinShop TJ")).toBeInTheDocument();
  expect(screen.queryByText(/2021|2022|2023/)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify failure**

Run: `npm run test -- tests/components/experience-timeline.test.tsx`  
Expected: FAIL because timeline component does not exist.

- [ ] **Step 3: Implement page content and editorial illustration**

Implement the home hero with the approved Russian positioning, a CSS/SVG `ТГ` monogram, CTA links to `/resume` and `/portfolio`, and a compact 2024/TUSUR/Next.js facts strip. Implement the resume page with H1, timeline, TUSUR education, skills, achievements from approved source content, and contact block. Use one H1 per page, a `time dateTime` value for every dated entry, and prose that says PinShop is in testing.

- [ ] **Step 4: Verify route content**

Run: `npm run test -- tests/components/experience-timeline.test.tsx && npm run build`  
Expected: PASS and static build includes `/` and `/resume`.

- [ ] **Step 5: Commit home and resume**

Run: `git add app/page.tsx app/resume components/sections/HomeHero.tsx components/sections/ExperienceTimeline.tsx components/sections/ResumeSummary.tsx tests/components/experience-timeline.test.tsx && git commit -m "feat: add home and resume pages"`

### Task 5: Implement the portfolio route and project imagery

**Files:**
- Create: `components/portfolio/ProjectCard.tsx`, `components/sections/PortfolioGrid.tsx`, `app/portfolio/page.tsx`
- Create: `public/images/project-nadim.jpg`, `public/images/profile-graphic.jpg`
- Create: `tests/components/project-card.test.tsx`

**Interfaces:**
- `ProjectCard({ project }: { project: Project })` renders title, category, summary, technologies, CSS/SVG illustration, and optional external GitHub anchor.
- `PortfolioGrid()` consumes the `projects` constant and renders exactly four cards.

- [ ] **Step 1: Copy only approved existing graphics and write failing card tests**

Copy `project_nadim.jpg` to `public/images/project-nadim.jpg` and `student.jpg` to `public/images/profile-graphic.jpg`. Do not copy graphics for removed projects. Then add:

```tsx
it("does not create an external link for PinShop", () => {
  render(<ProjectCard project={projects[1]} />);
  expect(screen.queryByRole("link", { name: /открыть проект/i })).not.toBeInTheDocument();
});

it("marks GitHub projects as external links", () => {
  render(<ProjectCard project={projects[2]} />);
  expect(screen.getByRole("link", { name: /открыть проект/i })).toHaveAttribute(
    "href", "https://github.com/tab11pm/moodle_math_mcp",
  );
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- tests/components/project-card.test.tsx`  
Expected: FAIL because `ProjectCard` does not exist.

- [ ] **Step 3: Implement four-card grid with visual distinction**

Render Nadim with its approved local graphic. Create unique decorative CSS/SVG artwork for PinShop TJ, Moodle Math MCP, and SDO MCP; each must be `aria-hidden` and paired with a textual title/category. Use `<a target="_blank" rel="noreferrer">` plus `ExternalLink` icon only when `project.href` exists. Ensure all cards stack into one column without horizontal overflow below 640px.

- [ ] **Step 4: Verify portfolio restrictions**

Run: `npm run test -- tests/components/project-card.test.tsx && npm run test -- tests/data/projects.test.ts && npm run build`  
Expected: PASS; built portfolio has four cards, no removed project title, and no PinShop anchor.

- [ ] **Step 5: Commit the portfolio route**

Run: `git add app/portfolio components/portfolio components/sections/PortfolioGrid.tsx public/images tests/components/project-card.test.tsx && git commit -m "feat: add selected project portfolio"`

### Task 6: Adapt background motion with a single runtime budget

**Files:**
- Create: `components/motion/BackdropProvider.tsx`, `components/motion/PixelCanvas.tsx`, `components/motion/DotMatrix.tsx`, `components/motion/WarpField.tsx`, `components/motion/Reveal.tsx`
- Create: `tests/components/reveal.test.tsx`, `tests/components/motion-reduced.test.tsx`
- Modify: `app/page.tsx`, `app/resume/page.tsx`, `app/portfolio/page.tsx`, `app/globals.css`

**Interfaces:**
- `registerBackdrop(source: { el: Element; draw: (elapsed: number) => void; fps?: number }): () => void` runs only the eligible canvas with greatest viewport coverage.
- `Reveal({ children, delay?: number })` renders content without hidden text when JavaScript or motion is disabled.
- `PixelCanvas`, `DotMatrix`, `WarpField` all render `aria-hidden="true"` canvas containers.

- [ ] **Step 1: Bring over the scheduler contract and write failing reduced-motion tests**

```tsx
it("keeps reveal content visible when reduced motion is requested", () => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() });
  render(<Reveal><p>Видимый текст</p></Reveal>);
  expect(screen.getByText("Видимый текст")).toBeVisible();
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- tests/components/reveal.test.tsx tests/components/motion-reduced.test.tsx`  
Expected: FAIL because motion components do not exist.

- [ ] **Step 3: Adapt source effects conservatively**

Port the scheduling logic from `/mnt/D/life/portfolio/lib/backdrop.ts`, preserving IntersectionObserver and `visibilitychange` pausing. Adapt `PixelCanvas` for the home hero, `DotMatrix` for `/resume`, and `WarpField` for `/portfolio`; cap each at 30fps and device pixel ratio 2. Use source CSS pattern for `prefers-reduced-motion`: draw one static frame, remove CSS keyframes, show reveal blocks immediately. Do not add pointer interaction that makes buttons or text move.

- [ ] **Step 4: Integrate and verify motion safety**

Run: `npm run test -- tests/components/reveal.test.tsx tests/components/motion-reduced.test.tsx && npm run lint && npm run build`  
Expected: PASS. Manually check that each canvas is behind content, animation stops when the tab is hidden, and no page becomes unreadable if JavaScript is disabled.

- [ ] **Step 5: Commit animation integration**

Run: `git add components/motion app/page.tsx app/resume/page.tsx app/portfolio/page.tsx app/globals.css tests/components && git commit -m "feat: add accessible ambient motion"`

### Task 7: Complete metadata, browser coverage, and Vercel handoff

**Files:**
- Modify: `app/layout.tsx`, `app/sitemap.ts`, `playwright.config.ts`, `tests/e2e/portfolio.spec.ts`, `README.md`
- Create: `public/og-image.svg`, `vercel.json`

**Interfaces:**
- `metadataBase` uses `NEXT_PUBLIC_SITE_URL` when supplied, otherwise local origin.
- `sitemap()` returns absolute entries for `/`, `/resume`, `/portfolio`.

- [ ] **Step 1: Write failing end-to-end checks**

```ts
for (const path of ["/", "/resume", "/portfolio"]) {
  test(`${path} renders one main landmark and one H1`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });
}

test("portfolio exposes only approved external repositories", async ({ page }) => {
  await page.goto("/portfolio");
  await expect(page.getByRole("link", { name: /moodle math mcp/i })).toHaveAttribute("href", /moodle_math_mcp/);
  await expect(page.getByRole("link", { name: /sdo mcp/i })).toHaveAttribute("href", /sdo-mcp/);
  await expect(page.getByText("PinShop TJ").locator("..").getByRole("link")).toHaveCount(0);
});
```

- [ ] **Step 2: Run E2E checks to verify failure before metadata/route completion**

Run: `npm run test:e2e`  
Expected: any missing route, heading, or link contract fails until Tasks 1–6 are complete.

- [ ] **Step 3: Implement production metadata and deployment documentation**

Set a unique Russian `title` and `description` for each route, define `metadataBase` through `readPublicEnv().siteUrl`, and write `sitemap.ts` with the three pages. Add a non-photographic `public/og-image.svg`. Write README commands: `npm install`, copy `.env.example` to `.env.local`, `npm run dev`, test/build commands, and Vercel import workflow. Add `vercel.json` only if required for explicit framework/build configuration; otherwise omit it rather than duplicating Next defaults.

- [ ] **Step 4: Run full local quality gates**

Run: `npm run test && npm run lint && npm run build && npm run test:e2e`  
Expected: all exit 0. Inspect 1440px and 375px Playwright screenshots; verify no horizontal scrolling, accessible focus, visible content with reduced motion, and all Vercel environment variable names documented.

- [ ] **Step 5: Create Vercel Preview and verify live behaviour**

Run: `npx vercel --yes` after authenticating and selecting the intended Vercel account/project.  
Expected: a Preview URL returns HTTP 200; open all three routes on the Preview URL and check document titles, images, motion, GitHub links, and the no-link PinShop card.

- [ ] **Step 6: Commit release-ready source**

Run: `git add app public tests playwright.config.ts README.md .env.example && git commit -m "feat: prepare portfolio for vercel"`

## Plan Self-Review

| Specification requirement | Covered by |
| --- | --- |
| Three Russian routes | Tasks 1, 3, 4, 5, 7 |
| Start public experience at 2024 | Task 2 tests and Task 4 rendering |
| PinShop testing status and no link | Tasks 2, 4, 5, 7 |
| Exact four projects and two GitHub links | Tasks 2, 5, 7 |
| Midnight Editorial with illustrations/icons | Tasks 3, 4, 5 |
| Reused controlled background animation | Task 6 |
| Accessibility and reduced motion | Tasks 3, 6, 7 |
| Build and Vercel proof | Tasks 1, 7 |

The plan contains no undecided product requirements. Git commit commands assume a Git repository is initialized before execution; the current workspace is not yet a Git repository.
