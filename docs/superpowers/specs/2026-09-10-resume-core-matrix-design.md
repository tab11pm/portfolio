# Resume — Aether Nexus Card Deck Design

**Date:** 2026-09-10
**Scope:** Present the approved résumé content as an interactive Aether Nexus-inspired deck while preserving the portfolio palette.

## Visual contract

The experience section is a single deck, not a grid or horizontal scroller. Four portrait cards share the same width, 2:3 aspect ratio, 24px radius, border, corner markers, typography, padding, and elevation recipe. The active card is flat and centred above the others. The remaining cards stay visible behind it as a controlled fan: one left, one right, and one lower centre.

The title remains an open editorial block above the deck. The deck uses the existing lilac, deep violet, gold, warm white, and dark surfaces. Experience facts and their canonical source in `data/experience.ts` remain unchanged; initial display order is PinShop TJ, Matrix IT, ТУСУР, then the editorial focus card.

## Interaction contract

- The active card responds to pointer position with restrained `rotateX`, `rotateY`, and translation, giving the impression that it exists in shallow 3D space.
- Pressing or touching the active card lifts it with a small scale increase and deeper shadow.
- Dragging at least 82px left or right moves the card out of the deck and promotes the next or previous card.
- Ordering is cyclic in both directions; after the fourth card comes the first.
- Cards never become a horizontal scroll strip. Page width must not overflow the viewport.
- Arrow Right advances and Arrow Left reverses for keyboard access.
- `prefers-reduced-motion: reduce` keeps the full deck visible and switches all transitions to immediate state changes.

## Rendering safeguards

Each card owns its transform independently. The deck does not use `transform-style: preserve-3d`, because nested 3D stacking caused Chromium to clip overlapping cards into diagonal fragments after cycling. The keyboard focus indicator belongs only to the active card; pointer interaction must not draw a frame around the full deck.

## Component boundaries

- `app/resume/page.tsx` derives the approved factual order.
- `components/ResumeMatrix.tsx` owns cyclic ordering, pointer capture, drag thresholds, hover tilt, GSAP layout transitions, keyboard navigation, and reduced-motion behaviour.
- `app/globals.css` owns the portrait deck geometry, common card shape, fan layout container, surfaces, shadows, and responsive sizing.
- `tests/components/resume-page.test.tsx` and `tests/components/resume-styles.test.ts` lock the semantic and CSS contracts.
- `tests/e2e/resume.spec.ts` verifies overlap, common geometry, z-order, hover motion, cyclic drag, lack of horizontal overflow, and reduced motion in Chromium.

## Verification contract

The completed implementation must pass the full Vitest suite, résumé Playwright checks, ESLint, and the Next.js production build. Desktop and 390px mobile rendering must be inspected in a real browser before completion.

## Out of scope

No changes to résumé facts, other routes, navigation, footer, downloadable documents, or the approved portfolio palette.
