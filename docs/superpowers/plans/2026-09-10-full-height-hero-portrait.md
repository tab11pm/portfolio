# Full-Height Hero Portrait Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enlarge the desktop hero portrait to the approved near-full-height treatment without cropping the transparent source image.

**Architecture:** The existing `MinimalistHero` remains the only owner of portrait layout. One responsive class change enlarges the image/fallback container and one matching class enlarges the circle; `object-contain` preserves the source silhouette.

**Tech Stack:** Next.js, Tailwind CSS, Vitest.

## Global Constraints

- Desktop portrait maximum height is `82vh`.
- Use `object-contain`; do not crop the face or silhouette.
- Preserve mobile dimensions and all hero content, colours, links, animations and accessibility.

---

### Task 1: Enlarge the desktop portrait without cropping

**Files:**
- Modify: `components/ui/minimalist-hero.tsx`
- Modify: `tests/components/minimalist-hero.test.tsx`
- Test: `tests/components/minimalist-hero.test.tsx`

**Interfaces:**
- Consumes: `MinimalistHeroProps.imageSrc` and `.imageAlt`.
- Produces: the same component API with responsive full-height portrait rendering.

- [ ] **Step 1: Add a failing layout-contract assertion**

  Add `data-testid="hero-portrait-frame"` to the desired image-frame API in the test expectation and assert it contains the Tailwind desktop maximum-height class `lg:h-[82vh]`. The current component has no test id and uses `lg:h-[28rem]`, so the test must fail first.

  ```tsx
  expect(screen.getByTestId("hero-portrait-frame")).toHaveClass("lg:h-[82vh]");
  ```

- [ ] **Step 2: Run the focused test to verify it fails**

  Run: `npm test -- tests/components/minimalist-hero.test.tsx`

  Expected: FAIL because the frame has neither the test id nor `lg:h-[82vh]`.

- [ ] **Step 3: Implement the responsive sizing change**

  In `components/ui/minimalist-hero.tsx`, assign `data-testid="hero-portrait-frame"` to the normal portrait motion container and replace desktop `lg:h-[28rem] lg:w-72` with `lg:h-[82vh] lg:w-[65vh]`. Change the image class from `object-cover object-center` to `object-contain object-center`. Apply the same desktop height/width pair to the fallback. Replace the circle's desktop `28rem` dimensions with `lg:h-[88vh] lg:w-[88vh]` so it remains a larger background disc.

- [ ] **Step 4: Run focused and production verification**

  Run: `npm test -- tests/components/minimalist-hero.test.tsx && npm run build`

  Expected: hero tests pass and build completes successfully.

- [ ] **Step 5: Commit the visual sizing adjustment**

  ```bash
  git add components/ui/minimalist-hero.tsx tests/components/minimalist-hero.test.tsx
  git commit -m "feat: enlarge hero portrait"
  ```

## Plan self-review

- Spec coverage: desktop size, non-cropping treatment, enlarged circle and unchanged mobile behaviour are all explicit.
- Placeholder scan: no deferred implementation or undefined interfaces remain.
- Type consistency: component props are unchanged.
