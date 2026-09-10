# Resume Aether Nexus Card Deck Implementation Plan

**Goal:** Replace the résumé matrix/scroller with a cyclic, overlapping portrait-card deck that feels physically draggable.

**Architecture:** The server page keeps factual selection and ordering. The client `ResumeMatrix` component maps four logical positions around the active index and lets GSAP animate each card between them. CSS supplies a common card material and responsive deck stage without horizontal document overflow.

**Tech Stack:** Next.js 16, React 19, TypeScript, GSAP, CSS, Vitest, Testing Library, Playwright.

## Global constraints

- Preserve `data/experience.ts` and the initial display order PinShop TJ, Matrix IT, ТУСУР.
- Preserve the current portfolio palette.
- Use four cards with identical dimensions, 2:3 aspect ratio, and 24px radius.
- Keep every card partly visible behind the active centred card.
- Cycle infinitely in both directions by pointer drag and arrow keys.
- Disable non-essential movement for reduced-motion users.
- Do not change unrelated routes or content.

## Implemented tasks

### Task 1: Lock the deck contract with tests

**Files:**
- `tests/components/resume-page.test.tsx`
- `tests/components/resume-styles.test.ts`
- `tests/e2e/resume.spec.ts`

- [x] Replace grid/scroll assertions with `.resume-deck` semantics.
- [x] Require equal card width, height, and radius.
- [x] Verify overlap and active-card z-order.
- [x] Verify hover changes the active transform.
- [x] Verify drag advances the deck and arrow navigation wraps cyclically.
- [x] Verify no horizontal page overflow and a static reduced-motion state.

### Task 2: Implement cyclic physical interaction

**Files:**
- `components/ResumeMatrix.tsx`

- [x] Model four reusable deck positions relative to `activeIndex`.
- [x] Animate initial layout and subsequent ordering with GSAP.
- [x] Capture pointer movement and apply lift, tilt, translation, and rotation only to the active card.
- [x] Commit a move after an 82px threshold; otherwise restore the card.
- [x] Support previous/next cycling with Arrow Left and Arrow Right.
- [x] Preserve semantic articles and reduced-motion behaviour.

### Task 3: Match the supplied deck reference

**Files:**
- `app/globals.css`

- [x] Replace horizontal scroll and scroll-snap with an overlapping stage.
- [x] Use portrait 2:3 cards, equal 24px corners, corner markers, and consistent shadows.
- [x] Fan the three inactive cards left, right, and lower centre.
- [x] Scale the deck for desktop and mobile without clipping the document.
- [x] Keep keyboard focus on the active card rather than framing the full stage.
- [x] Avoid nested `preserve-3d` stacking that clips cards in Chromium.

### Task 4: Verify the completed result

- [x] `npm test`
- [x] `npx playwright test tests/e2e/resume.spec.ts --workers=1`
- [x] `npm run lint`
- [x] `TMPDIR=/mnt/D/tusur/portfolio npm run build`
- [x] Inspect desktop, mobile, initial deck, and post-cycle 3D states in Chromium.
