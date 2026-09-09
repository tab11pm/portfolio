# Transparent Hero Portrait Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage portrait asset with the approved transparent-background source image.

**Architecture:** The homepage already loads `/images/hero-portrait.png`; only that local public asset changes. No component, route, colour, copy, or image API changes are required.

**Tech Stack:** Next.js public assets, PNG.

## Global Constraints

- Source must be `/home/tab/Downloads/ChatGPT Image Sep 10, 2026, 12_08_36 AM.png`.
- Destination must remain `public/images/hero-portrait.png`.
- Keep the existing hero layout, purple circle, path and alt text unchanged.

---

### Task 1: Replace and verify the portrait asset

**Files:**
- Modify: `public/images/hero-portrait.png`
- Test: `tests/components/minimalist-hero.test.tsx`

**Interfaces:**
- Consumes: `imageSrc="/images/hero-portrait.png"` and `imageAlt="Портрет Табреза Шонизорова"` in `app/page.tsx`.
- Produces: the same public URL backed by the approved transparent portrait.

- [ ] **Step 1: Preserve the existing consumer contract test**

  Run: `npm test -- tests/components/minimalist-hero.test.tsx`

  Expected: PASS; the homepage continues to expose the approved portrait alternative text and local image path contract before the binary source changes.

- [ ] **Step 2: Copy the approved source asset**

  Run:

  ```bash
  cp '/home/tab/Downloads/ChatGPT Image Sep 10, 2026, 12_08_36 AM.png' public/images/hero-portrait.png
  ```

- [ ] **Step 3: Verify the copied asset and consumer contract**

  Run:

  ```bash
  file public/images/hero-portrait.png
  npm test -- tests/components/minimalist-hero.test.tsx
  npm run build
  ```

  Expected: `file` reports PNG data; hero tests pass; production build succeeds.

- [ ] **Step 4: Commit the asset replacement**

  ```bash
  git add public/images/hero-portrait.png
  git commit -m "feat: use transparent hero portrait"
  ```

## Plan self-review

- Spec coverage: the plan changes the approved source file at the required stable public path and verifies the homepage contract and production build.
- Placeholder scan: no deferred work or undefined interfaces remain.
- Type consistency: no TypeScript API changes occur.
