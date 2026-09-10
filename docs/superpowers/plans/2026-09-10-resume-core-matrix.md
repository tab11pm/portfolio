# Resume Aether Nexus Core Matrix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `/resume` with the supplied Aether Nexus Core Matrix design system, adapting only its colour roles to the portfolio palette and adding its minimal GSAP motion.

**Architecture:** The server page derives the approved display order from unchanged experience data. A client `ResumeMatrix` component owns semantic card markup and GSAP ScrollTrigger lifecycle. Scoped CSS supplies the full-bleed 12-column matrix, exact typography/spacing/elevation constraints, responsive collapse, and reduced-motion fallback.

**Tech Stack:** Next.js 16, React 19, TypeScript, GSAP with ScrollTrigger, CSS, Vitest, Testing Library.

## Global Constraints

- Preserve data facts and the canonical array order in `data/experience.ts`.
- Display PinShop TJ, Matrix IT, and ТУСУР in that explicit order.
- Adapt only reference colour roles to `--bg`, `--accent`, `--hot`, and existing portfolio neutrals.
- Use full-bleed grid, 8px rhythm, 32px cards, Inter/Space Mono hierarchy, supplied radius/border/elevation family, and minimal motion.
- Always render readable static content; reduced motion disables GSAP and transforms.
- Do not modify unrelated pages, routes, header/footer, or résumé facts.

---

## File structure

- `package.json`, `package-lock.json` — add the `gsap` runtime dependency.
- `app/resume/page.tsx` — derive and pass display-order experience entries.
- `components/ResumeMatrix.tsx` — client-side matrix markup and ScrollTrigger cleanup.
- `app/globals.css` — replace old résumé rules with faithful Core Matrix styling.
- `tests/components/resume-page.test.tsx` — assert content, order, semantic cards, and animation hook classes.

### Task 1: Lock down the reference-facing page contract

**Files:**
- Modify: `tests/components/resume-page.test.tsx`

**Interfaces:**
- Consumes: default `ResumePage()`.
- Produces: test coverage for the `.resume-matrix`, ordered card classes, and `.resume-reveal` motion hook.

- [ ] **Step 1: Extend the failing test**

Add these assertions after the existing card-class expectation:

```tsx
expect(container.querySelector(".resume-matrix")).toBeInTheDocument();
expect(cards.every((card) => card.classList.contains("resume-reveal"))).toBe(true);
expect(container.querySelectorAll(".resume-parallax")).toHaveLength(2);
```

- [ ] **Step 2: Run the focused test**

Run: `npm test -- tests/components/resume-page.test.tsx`

Expected: FAIL because the current page does not expose the matrix or motion hook classes.

### Task 2: Add the GSAP matrix component and data boundary

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `components/ResumeMatrix.tsx`
- Modify: `app/resume/page.tsx`

**Interfaces:**
- Consumes: `readonly ExperienceEntry[]` in the approved display order.
- Produces: `ResumeMatrix({ entries }: { entries: readonly ExperienceEntry[] })` with four semantic articles and the `resume-reveal`/`resume-parallax` hooks expected by Task 1.

- [ ] **Step 1: Install the animation dependency**

Run: `npm install gsap`

Expected: `package.json` gains `gsap` under `dependencies`; the lockfile records its resolved package.

- [ ] **Step 2: Implement the client component**

Create `components/ResumeMatrix.tsx` with `"use client"`. Register `ScrollTrigger`, create a `gsap.context()` over a `ref`, and return its cleanup in `useLayoutEffect`. Before creating triggers, use `window.matchMedia("(prefers-reduced-motion: reduce)").matches`; if true, call `gsap.set(cards, { autoAlpha: 1, y: 0 })` and return. Otherwise reveal `.resume-reveal` cards once via `gsap.fromTo` and give `.resume-parallax` a restrained `yPercent` ScrollTrigger tween. Map the first three entries to lead/side/lower articles; add the exact editorial sentence in the fourth article.

- [ ] **Step 3: Keep the data source canonical**

In `app/resume/page.tsx`, derive entries by matching `"PinShop TJ"`, `"Matrix IT"`, and `"ТУСУР"` against `experience`, throw if one is absent, and render `<ResumeMatrix entries={resumeExperience} />`. Do not reorder or edit `experience` itself.

- [ ] **Step 4: Run the focused test**

Run: `npm test -- tests/components/resume-page.test.tsx`

Expected: PASS.

### Task 3: Apply the exact Core Matrix styling and verify runtime behaviour

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `.resume-matrix`, `.resume-card--lead`, `.resume-card--side`, `.resume-card--lower`, `.resume-card--editorial`, `.resume-reveal`, and `.resume-parallax` from `ResumeMatrix`.
- Produces: full-bleed responsive presentation whose content remains visible when motion is reduced.

- [ ] **Step 1: Replace the current résumé CSS**

Use a full-bleed 12-column `.resume-matrix` with 8px gaps and 32px page/card padding. Load Inter in the existing font import and use it for card display headings at 48px/48px/-0.05em; use `DM Mono` as the existing Space-Mono-like utility face for 9px uppercase labels. Apply the mapped lilac lead surface, deep/dark secondary panels, gold tertiary detail, 1px/2px border family, 2px/4px/24px radii, and the reference inset/highlight shadows. At 700px, change all cards to one column. In `@media (prefers-reduced-motion: reduce)`, force opacity and transform to visible/resting values and disable transition.

- [ ] **Step 2: Verify focused and full checks**

Run:

```bash
npm test -- tests/components/resume-page.test.tsx tests/data/public-content.test.ts
npm test
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 3: Inspect actual browser behaviour**

Run `npm run dev`; inspect `/resume` at desktop and 390px wide. Confirm the full-bleed matrix, 8/4 then 4/8 spans, one-column mobile order, initial reveal, scroll parallax on lead/editorial cards, and static readable reduced-motion state.

- [ ] **Step 4: Commit only the redesign**

```bash
git add package.json package-lock.json app/resume/page.tsx components/ResumeMatrix.tsx app/globals.css tests/components/resume-page.test.tsx
git diff --cached --check
git commit -m "feat: apply aether nexus resume design"
```

## Plan self-review

- **Spec coverage:** Tasks cover the reference layout, only-colour adaptation, typography, elevation, motion, reduced motion, data integrity, testing, and browser verification.
- **No placeholders:** Every task names its files, contracts, assertions, commands, and required motion behaviour.
- **Consistency:** The test hooks in Task 1 are created in Task 2 and styled in Task 3.
