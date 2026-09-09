# Resume Core Matrix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/resume` as a responsive Core Matrix-inspired experience grid using the portfolio's existing palette and factual experience data.

**Architecture:** `data/experience.ts` remains the canonical factual source and is not reordered. `app/resume/page.tsx` derives a display sequence by company name, renders the three data records into named grid roles, and adds one static editorial module. Scoped CSS in `app/globals.css` supplies the desktop 8/4 then 4/8 matrix and its one-column mobile fallback.

**Tech Stack:** Next.js 16, React 19, TypeScript, global CSS, Vitest, Testing Library.

## Global Constraints

- Preserve the existing global colour tokens; use only the current dark, lilac, gold, and warm-light palette.
- Do not alter facts, dates, roles, descriptions, or canonical ordering in `data/experience.ts`.
- Display experience in the approved order: PinShop TJ, Matrix IT, then ТУСУР.
- Do not add dependencies, motion, filters, routes, downloadable assets, or changes to unrelated pages.
- Keep semantic article content and readable order without relying on colour or visual position.
- At `max-width: 700px`, show the lead, side, lower, and editorial modules in that one-column order.

---

## File structure

- `app/resume/page.tsx` — derives the approved display order, defines the page's semantic matrix markup, and maps the three factual entries into card roles.
- `app/globals.css` — adds only `.resume-*` rules for the desktop module spans, restrained card surfaces, and mobile collapse.
- `tests/components/resume-page.test.tsx` — locks down all factual card content, display ordering, editorial copy, and semantic card structure.

### Task 1: Build and verify the résumé matrix

**Files:**
- Create: `tests/components/resume-page.test.tsx`
- Modify: `app/resume/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `experience: readonly ExperienceEntry[]` from `@/data/experience`, where entries have `period`, `company`, `role`, and `description`.
- Produces: default `ResumePage()` with a `resume-grid` containing the `resume-card--lead`, `resume-card--side`, `resume-card--lower`, and `resume-card--editorial` articles.

- [ ] **Step 1: Write the failing page test**

Create `tests/components/resume-page.test.tsx` with this exact test. It makes both the intended content and the deliberate visual ordering observable without changing the source data's canonical order.

```tsx
import { render, screen, within } from "@testing-library/react";
import ResumePage from "@/app/resume/page";

it("renders the approved Core Matrix résumé cards in display order", () => {
  const { container } = render(<ResumePage />);

  expect(screen.getByRole("heading", { level: 1, name: "Опыт, системность, рост." })).toBeInTheDocument();

  const cards = Array.from(container.querySelectorAll(".resume-grid > article"));
  expect(cards).toHaveLength(4);
  expect(cards.map((card) => card.className)).toEqual([
    "resume-card resume-card--lead",
    "resume-card resume-card--side",
    "resume-card resume-card--lower",
    "resume-card resume-card--editorial",
  ]);

  expect(within(cards[0]).getByText("PinShop TJ")).toBeInTheDocument();
  expect(within(cards[0]).getByText("2026—сейчас")).toBeInTheDocument();
  expect(within(cards[1]).getByText("Matrix IT")).toBeInTheDocument();
  expect(within(cards[1]).getByText("2024—2026")).toBeInTheDocument();
  expect(within(cards[2]).getByText("ТУСУР")).toBeInTheDocument();
  expect(within(cards[2]).getByText("2024—2028")).toBeInTheDocument();
  expect(within(cards[3]).getByText("Строю продукты и беру ответственность за систему.")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/components/resume-page.test.tsx`

Expected: FAIL because the résumé grid and its four card classes do not exist yet.

- [ ] **Step 3: Replace the timeline markup with semantic matrix markup**

In `app/resume/page.tsx`, retain the existing `experience` import and define the display list before the component:

```tsx
const resumeExperience = ["PinShop TJ", "Matrix IT", "ТУСУР"].map((company) => {
  const entry = experience.find((item) => item.company === company);

  if (!entry) {
    throw new Error(`Missing résumé entry for ${company}`);
  }

  return entry;
});
```

Render the existing eyebrow and heading followed by this four-article structure. Map `resumeExperience` to `lead`, `side`, and `lower` by index; print `item.period`, `item.company`, `item.role`, and `item.description` in each data card. The editorial article contains exactly the approved sentence.

```tsx
<section className="page resume-page">
  <p className="eyebrow">Резюме</p>
  <h1>Опыт, системность, рост.</h1>
  <div className="resume-grid">
    {resumeExperience.map((item, index) => {
      const role = ["lead", "side", "lower"][index];
      return (
        <article className={`resume-card resume-card--${role}`} key={item.company}>
          <time>{item.period}</time>
          <h2>{item.company}</h2>
          <strong>{item.role}</strong>
          <p>{item.description}</p>
          <span aria-hidden="true">0{index + 1}</span>
        </article>
      );
    })}
    <article className="resume-card resume-card--editorial">
      <p>Фокус</p>
      <h2>Строю продукты и беру ответственность за систему.</h2>
    </article>
  </div>
</section>
```

- [ ] **Step 4: Add scoped Core Matrix styles and mobile collapse**

Append scoped `.resume-*` CSS after the existing timeline rules in `app/globals.css`. Define `.resume-grid` as a 12-column grid with the existing spacing cadence; give `.resume-card--lead` an 8-column lilac surface and dark text, `.resume-card--side` a 4-column dark surface, `.resume-card--lower` a 4-column warm-light surface and dark text, and `.resume-card--editorial` an 8-column dark surface. Use thin borders, `clamp()` headings, existing `DM Mono` for utility text, and `position: relative` for the quiet index. Inside the existing `@media(max-width:700px)` block, set `.resume-card--lead`, `.resume-card--side`, `.resume-card--lower`, and `.resume-card--editorial` to `grid-column:span 12`.

- [ ] **Step 5: Run focused automated checks**

Run:

```bash
npm test -- tests/components/resume-page.test.tsx tests/data/public-content.test.ts
```

Expected: PASS. The new page test confirms display order and all content; the public-content test confirms canonical source data stays unchanged.

- [ ] **Step 6: Run the project quality gate and inspect both layouts**

Run:

```bash
npm test
npm run build
```

Expected: both commands exit 0. Then run `npm run dev`, inspect `/resume` at a desktop viewport and at 700px or narrower, and confirm the specified 8/4 then 4/8 spans collapse to one column in the specified order.

- [ ] **Step 7: Commit the implementation atomically**

```bash
git add app/resume/page.tsx app/globals.css tests/components/resume-page.test.tsx
git diff --cached --check
git commit -m "feat: redesign resume as experience matrix"
```

Expected: one commit containing only the résumé page, its scoped styling, and its focused test.

## Plan self-review

- **Spec coverage:** Task 1 preserves the data source and palette, implements the four-module desktop layout and one-column mobile layout, retains semantic content, adds no motion/dependencies, and verifies both facts and rendering.
- **No placeholders:** The task gives exact files, test code, card classes, display ordering, copy, commands, and commit scope.
- **Consistency:** The `resume-card--lead`, `resume-card--side`, `resume-card--lower`, and `resume-card--editorial` interfaces asserted by the test are the same classes produced by the page and styled by CSS.
