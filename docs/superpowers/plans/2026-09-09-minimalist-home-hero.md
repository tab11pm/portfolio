# Minimalist Home Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current homepage hero with the approved animated Minimalist Hero composition, using the existing Midnight Editorial colours and the approved local portrait.

**Architecture:** A reusable client-side `MinimalistHero` receives typed, page-owned content and interactions. A small client shell suppresses the shared `Header` and `Footer` only on `/`, leaving the existing two secondary routes unchanged. The local portrait and CSS variables ensure the page has no external image or colour dependency.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lucide React, Vitest, Testing Library.

## Global Constraints

- Preserve the Midnight Editorial palette in `app/globals.css`; never introduce the source example's yellow colour classes.
- Store the approved portrait as `public/images/hero-portrait.png`; do not point the application at Downloads or an external CDN.
- Hero navigation must link to `/`, `/resume`, and `/portfolio`; CTA links to `/portfolio`.
- Use exactly five external contact targets: GitHub, personal Telegram, LinkedIn, Telegram channel, and `mailto:tabrez.frontend@gmail.com`.
- The supplied malformed LinkedIn URL is canonicalized to `https://www.linkedin.com/in/tabrez-shonizorov-48043434b/`.
- Reduced-motion users see the same content without entrance animation.

---

## File structure

| File | Responsibility |
| --- | --- |
| `lib/utils.ts` | Small typed `cn` class-name joiner required by the UI component. |
| `components/SiteChrome.tsx` | Shows shared site Header/Footer except on the home route. |
| `components/ui/minimalist-hero.tsx` | Client component: responsive hero, navigation, menu state, portrait fallback, contacts and motion behaviour. |
| `app/layout.tsx` | Delegates shared chrome to `SiteChrome` while retaining server metadata and the main landmark. |
| `app/page.tsx` | Supplies approved Russian homepage content and contact configuration. |
| `app/globals.css` | Supplies narrowly scoped fallback, mobile-menu and reduced-motion rules needed by the component. |
| `public/images/hero-portrait.png` | Approved 1122×1402 portrait copied from Downloads into build-managed public assets. |
| `tests/components/minimalist-hero.test.tsx` | Hero contracts: text, routes, contacts, image alternative and menu state. |
| `tests/components/root-shell.test.tsx` | Route-specific assertion that secondary pages retain the common landmarks. |

### Task 1: Establish component contracts and supporting shell

**Files:**
- Create: `lib/utils.ts`
- Create: `components/SiteChrome.tsx`
- Modify: `app/layout.tsx`
- Modify: `tests/components/root-shell.test.tsx`
- Test: `tests/components/root-shell.test.tsx`

**Interfaces:**
- Consumes: `Header` and `Footer` exports from `components/Header.tsx` and `components/Footer.tsx`.
- Produces: `cn(...values: Array<string | false | null | undefined>): string` and `SiteChrome({ children }: { children: ReactNode }): JSX.Element`.

- [ ] **Step 1: Write the failing non-home shell test**

  Replace the current route-agnostic layout expectation with a test that mocks `usePathname` from `next/navigation`, returns `"/portfolio"`, renders `RootLayout`, and asserts `banner`, `main`, and `contentinfo` exist. Add a second test with the mock returning `"/"` that asserts the page has `main` but no outer `banner` or `contentinfo`.

  ```tsx
  const pathname = vi.hoisted(() => vi.fn());
  vi.mock("next/navigation", () => ({ usePathname: pathname }));
  pathname.mockReturnValue("/portfolio");
  render(<RootLayout><p>Страница</p></RootLayout>);
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  ```

- [ ] **Step 2: Run the shell test to verify it fails**

  Run: `npm test -- tests/components/root-shell.test.tsx`

  Expected: FAIL because the layout currently renders Header/Footer on `/` too.

- [ ] **Step 3: Add the minimal utility and route-aware shell**

  Create `lib/utils.ts`:

  ```ts
  export function cn(...values: Array<string | false | null | undefined>) {
    return values.filter(Boolean).join(" ");
  }
  ```

  Create a `"use client"` `SiteChrome` that calls `usePathname()`. On `/`, return `<main>{children}</main>`; otherwise return Header, `<main>{children}</main>`, Footer. Modify `RootLayout` to render `<SiteChrome>{children}</SiteChrome>` in its body and retain its current metadata and `<html lang="ru">`.

- [ ] **Step 4: Run the shell test to verify it passes**

  Run: `npm test -- tests/components/root-shell.test.tsx`

  Expected: PASS; home has no duplicated global chrome, and `/portfolio` retains it.

- [ ] **Step 5: Commit the supporting contract**

  ```bash
  git add lib/utils.ts components/SiteChrome.tsx app/layout.tsx tests/components/root-shell.test.tsx
  git commit -m "feat: make site chrome route-aware"
  ```

### Task 2: Build the tested Minimalist Hero component

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `components/ui/minimalist-hero.tsx`
- Create: `tests/components/minimalist-hero.test.tsx`
- Modify: `app/globals.css`
- Test: `tests/components/minimalist-hero.test.tsx`

**Interfaces:**
- Consumes: `cn` from `lib/utils.ts`; `motion` from `framer-motion`; `LucideIcon` from `lucide-react`.
- Produces: `MinimalistHero(props: MinimalistHeroProps)` where props include `logoText`, `navLinks`, `mainText`, `readMoreLink`, `imageSrc`, `imageAlt`, two-part `overlayText`, `socialLinks`, `locationText`, and optional `className`.

- [ ] **Step 1: Install the animation dependency**

  Run: `npm install framer-motion`

  Expected: `package.json` and lockfile list `framer-motion`; retain the existing `lucide-react` dependency.

- [ ] **Step 2: Write the failing component tests**

  Create a test fixture containing the three internal routes, one CTA, five social links, and a portrait. Assert the logo, heading parts and supplied description render; assert the internal route hrefs and CTA href; assert the four web-profile links have their expected external hrefs and `target="_blank"`; assert the email has its expected `mailto:` href without `target`; assert the `img` accessible name equals the passed alt text. Click the `aria-label="Открыть меню"` button and assert the mobile navigation becomes visible.

  ```tsx
  expect(screen.getByRole("link", { name: "Портфолио" })).toHaveAttribute("href", "/portfolio");
  expect(screen.getByRole("img", { name: "Портрет Табреза Шонизорова" })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Открыть меню" }));
  expect(screen.getByRole("navigation", { name: "Мобильная навигация" })).toBeVisible();
  ```

- [ ] **Step 3: Run the component test to verify it fails**

  Run: `npm test -- tests/components/minimalist-hero.test.tsx`

  Expected: FAIL because `MinimalistHero` does not exist.

- [ ] **Step 4: Implement the minimal client component**

  Add `"use client"` and the exported props interface. Use `motion` wrappers for the entered logo, navigation/menu, copy, circle, photo, heading and contact strip. Use `<Image>` for the portrait with a stateful `onError` branch that replaces it with a labelled CSS fallback; do not use the source component's remote SVG assignment. Render desktop links in a named navigation landmark and a controlled `useState(false)` mobile menu with Russian button labels.

  Use `bg-[var(--accent)]` for the circle, `bg-[var(--bg)]` and `text-[var(--text)]` for the surface, and existing muted/text variables for secondary text. Do not use `bg-yellow-*`, literal source-example branding, or English `Read More` copy.

  Add only scoped styles to `app/globals.css`: `.minimalist-hero-fallback`, mobile-menu positioning, and `@media (prefers-reduced-motion: reduce)` rules that force motion-dependent CSS transitions to none. The component's motion props must set `initial={false}` when `useReducedMotion()` is true.

- [ ] **Step 5: Run the focused test to verify it passes**

  Run: `npm test -- tests/components/minimalist-hero.test.tsx`

  Expected: PASS; all semantic content, destinations and menu control are covered.

- [ ] **Step 6: Commit the reusable hero**

  ```bash
  git add package.json package-lock.json components/ui/minimalist-hero.tsx app/globals.css tests/components/minimalist-hero.test.tsx
  git commit -m "feat: add minimalist hero component"
  ```

### Task 3: Wire approved content, portrait and responsive page behaviour

**Files:**
- Create: `public/images/hero-portrait.png`
- Modify: `app/page.tsx`
- Modify: `tests/components/minimalist-hero.test.tsx`
- Test: `tests/components/minimalist-hero.test.tsx`

**Interfaces:**
- Consumes: `MinimalistHero` from `components/ui/minimalist-hero.tsx`; `Github`, `Send`, `Linkedin`, `Radio`, and `Mail` Lucide icons.
- Produces: Homepage rendering the approved hero configuration.

- [ ] **Step 1: Extend the failing integration assertion with approved content**

  Render `HomePage` and assert the Russian positioning copy, `href="/portfolio"`, all five approved destinations, the location `Томск, Россия`, the hero portrait alt text, and no outer `banner`/`contentinfo` duplication when rendered through `RootLayout` at `/`.

  ```tsx
  expect(screen.getByText("Томск, Россия")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /GitHub/i })).toHaveAttribute("href", "https://github.com/tab11pm/");
  expect(screen.getByRole("link", { name: "Смотреть работы" })).toHaveAttribute("href", "/portfolio");
  ```

- [ ] **Step 2: Run the integration assertion to verify it fails**

  Run: `npm test -- tests/components/minimalist-hero.test.tsx`

  Expected: FAIL because `app/page.tsx` still renders the old orbit hero.

- [ ] **Step 3: Add the approved image and configure the homepage**

  Copy exactly `/home/tab/Downloads/ChatGPT Image Sep 9, 2026, 11_42_24 PM.png` to `public/images/hero-portrait.png`. Replace the old `AmbientCanvas`/orbit markup in `app/page.tsx` with `MinimalistHero` configured as follows:

  ```tsx
  logoText="ТШ"
  mainText="Табрез Шонизоров — разработчик, который соединяет продуктовый подход, интерфейсы и инженерную системность."
  readMoreLink="/portfolio"
  imageSrc="/images/hero-portrait.png"
  imageAlt="Портрет Табреза Шонизорова"
  overlayText={{ part1: "Создаю понятные", part2: "цифровые продукты." }}
  locationText="Томск, Россия"
  ```

  Supply links labelled `Главная`, `Резюме`, `Портфолио` and the exact approved contacts listed in Global Constraints. Give each social control an accessible label in the component data (for example, `GitHub`, `Telegram`, `LinkedIn`, `Telegram-канал`, `Email`). Remove imports that are no longer used by the homepage, but do not delete `AmbientCanvas` because it remains an independently tested reusable component.

- [ ] **Step 4: Run focused verification**

  Run: `npx tsc --noEmit && npm test -- tests/components/minimalist-hero.test.tsx && npm run lint && npm test && npm run build`

  Expected: all commands exit 0. The build emits static routes `/`, `/resume`, and `/portfolio` without a remote image-host configuration error.

- [ ] **Step 5: Perform manual responsive and motion smoke checks**

  Run: `npm run dev`

  Verify at desktop and a 390px-wide viewport: central portrait stays visible without facial cropping; the purple circle uses the existing palette; header, grid and contact row follow the approved order; mobile menu opens and closes; `prefers-reduced-motion: reduce` reveals content immediately. Confirm `/resume` and `/portfolio` still show their shared Header/Footer.

- [ ] **Step 6: Commit the integrated page and asset**

  ```bash
  git add app/page.tsx public/images/hero-portrait.png tests/components/minimalist-hero.test.tsx
  git commit -m "feat: integrate minimalist homepage hero"
  ```

## Plan self-review

- Spec coverage: Tasks 1–3 cover route-specific chrome, every approved hero region, current palette, local image storage, five contacts, mobile menu, animation/reduced-motion behaviour and all requested verification gates.
- Placeholder scan: no `TODO`, `TBD`, deferred implementation text or undefined interfaces remain.
- Type consistency: Task 1 defines `cn` consumed by Task 2; Task 2 defines `MinimalistHero` consumed by Task 3. Homepage fields exactly match the props named in Task 2.
