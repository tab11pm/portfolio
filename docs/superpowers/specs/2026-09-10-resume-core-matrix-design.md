# Resume — Aether Nexus Core Matrix Design

**Date:** 2026-09-10
**Scope:** Replace the current `/resume` design with a faithful application of the supplied “Aether Nexus — Core Matrix” brief. Only the reference colour roles are adapted to the portfolio palette.

## Non-negotiable reference contract

The page uses the supplied reference as its design system, not as loose inspiration:

- full-bleed, open-frame, strong-grid composition;
- 8px base rhythm; 8px, 12px, 16px, 24px, and 32px spacing only;
- 32px card and section padding;
- Inter display typography at 48px / 48px / -0.05em and Space Mono uppercase utility typography at 9px / 11.25px;
- controlled 2px, 4px, 24px, and pill radius family;
- elevated cards with the supplied inset/highlight shadow language and 1px/2px borders;
- minimal, interface-led ScrollTrigger reveal and parallax choreography with `ease` timing;
- no extra colours, unrelated shadows, gratuitous blur, or higher-than-minimal motion.

## Palette adaptation only

All non-colour visual choices above remain unchanged. Replace reference colour roles with existing portfolio colours:

| Reference role | Portfolio role |
| --- | --- |
| primary surface `#F43F5E` | lilac `--accent` (`#b7a5ff`) |
| secondary `#8B5CF6` | deep violet from the existing background field (`#2b2052`) |
| tertiary `#FAA443` | gold `--hot` (`#f0cc6d`) |
| neutral/background `#050505` | `--bg` (`#0a0a0c`) |
| light card text | existing dark ink `#0a0a0c` |
| dark card text | `--text` (`#f3efe8`) and `--muted` |

## Layout and cards

`/resume` breaks out of the site content-width constraint and uses a 12-column full-bleed grid, with a 32px page inset on desktop and an 8px grid gap.

The title block is an open section above the grid. The experience cards are a deliberately asymmetric matrix: PinShop TJ spans eight columns as the primary lilac surface; Matrix IT spans four columns on a dark elevated surface; ТУСУР spans four columns in the warm-light surface; the last eight columns are a dark editorial focus card. Every card uses 32px padding, compact uppercase metadata, Inter title/role hierarchy, a numeric index, controlled radius, and the prescribed border/elevation treatment.

Source facts remain in `data/experience.ts` unchanged. The display order is deliberately PinShop TJ, Matrix IT, then ТУСУР; the page derives that order without changing canonical data order.

## Motion

The matrix is a client-side visual component because it owns the reference-required GSAP animation.

1. With normal motion enabled, each card begins subtly lower and transparent, then reveals once as it enters the viewport with `ease` and short staggered timing.
2. The lead and editorial cards receive a restrained scroll-linked vertical parallax offset; side and lower cards remain anchored to preserve legibility.
3. Hover/focus adds only a short elevation/translation response.
4. With `prefers-reduced-motion: reduce`, all cards are visible immediately and no GSAP scroll triggers or hover transforms run.

## Component boundaries

- `app/resume/page.tsx` selects factual entries in display order and supplies them to the matrix.
- `components/ResumeMatrix.tsx` is the client component for semantic card markup, GSAP registration, reveal lifecycle, and motion preference handling.
- `app/globals.css` holds only `.resume-*` styling and media/reduced-motion rules.
- `tests/components/resume-page.test.tsx` verifies the factual content, visual role order, editorial copy, and semantic articles.

## Verification

1. Test the matrix content and order with Vitest/Testing Library.
2. Run the complete test suite and production build.
3. Inspect `/resume` in a real browser at desktop and mobile widths, including reduced-motion behaviour.
4. Confirm the active ScrollTrigger animation does not move or hide content when reduced motion is enabled.

## Out of scope

No change to résumé facts, other routes, header/footer, routing, downloadable PDF, filters, or colours outside the mapped palette roles.
