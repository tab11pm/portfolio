# Resume Core Matrix Design

**Date:** 2026-09-10
**Scope:** Redesign only the `/resume` page using the approved structural ideas from the provided Aether Nexus Core Matrix reference.

## Goal

Turn the terse chronological résumé into a visually deliberate, responsive experience map. It must retain the portfolio's existing dark, lilac, gold, and warm-light palette; it must not import the reference palette or introduce a new design system.

## Visual composition

The page remains a single full-width content region within the existing site chrome.

1. The heading area has the existing eyebrow and the title “Опыт, системность, рост.”
2. Below it, a 12-column modular grid uses a small consistent gap and thin, high-contrast borders.
3. The PinShop TJ entry is the lead card: it spans two-thirds of the desktop grid, uses the existing lilac accent as its surface, and uses dark text.
4. The Matrix IT entry occupies the remaining third on the first row, on a restrained dark surface.
5. The ТУСУР entry begins the second row on a warm-light surface; a wide dark editorial card fills the remaining grid space with the approved focus statement: “Строю продукты и беру ответственность за систему.”
6. Each experience card contains period, organisation, role, description, and a quiet numeric index. No ornamental icons, gradients inside cards, animated effects, or extra colours are added.

This retains the reference's asymmetric modular-card structure, fixed spacing rhythm, compact utility labels, and open grid framing while matching the rest of the site.

## Data and component boundaries

`data/experience.ts` remains the source of truth for the three factual experience records. The résumé page maps those records to a fixed visual role by their existing order: lead, side, lower. The editorial card is static presentation copy, not a new résumé data record.

The page may add narrowly scoped class names and CSS rules to `app/globals.css`. It must not change the global colour tokens, header/footer, home page, portfolio page, public data, or routing.

## Responsive and accessibility behaviour

- At the existing mobile breakpoint, all four modules become a single-column sequence: PinShop, Matrix IT, ТУСУР, editorial card.
- Semantic article/list structure and readable chronological text remain available without relying on colour or layout position.
- Existing focus styles and reduced-motion policy remain effective; this redesign adds no motion.
- Text colour on lilac and warm-light cards uses the existing dark ink for contrast; dark cards retain light text.

## Verification

1. Update the résumé component test to assert all three factual records and the editorial statement render.
2. Run the focused résumé/page test and the relevant public-content test.
3. Run the project type-check or test command specified in `package.json` if the focused checks expose shared failures.
4. Inspect `/resume` at desktop and mobile widths to confirm the 8/4 then 4/8 desktop spans and one-column mobile order.

## Out of scope

- Changing résumé facts, dates, roles, or descriptions.
- Downloadable PDF, filters, interactions, animation, new dependencies, or changes outside `/resume` and its targeted tests/styles.
