# Главная: социальные ссылки и мобильный footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Убрать Telegram-канал с главной страницы и скрыть социальные иконки в её мобильном footer, сохранив кнопку и навигацию мобильного меню.

**Architecture:** `app/page.tsx` остаётся единственным источником списка социальных ссылок. `MinimalistHero` отвечает только за адаптивную видимость уже переданных ссылок: Tailwind-классы скрывают их ниже `md`, не меняя состояние мобильной навигации или desktop-разметку.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Vitest, Testing Library.

## Global Constraints

- Не менять палитру, текст, портрет, анимации или desktop-навигацию главной.
- Удалить только `Telegram-канал` (`https://t.me/ai_na_practike`); личный Telegram, GitHub, LinkedIn и email на desktop остаются.
- На ширинах меньше `md` социальные иконки footer не отображаются; кнопка меню и три ссылки в мобильной навигации сохраняются.
- Не добавлять зависимости.

---

### Task 1: Проверить публичные контакты и мобильное поведение главной

**Files:**
- Modify: `tests/components/minimalist-hero.test.tsx:1-76`
- Modify: `app/page.tsx:14-20`
- Modify: `components/ui/minimalist-hero.tsx:58-58`

**Interfaces:**
- Consumes: `HomePage` с массивом `socialLinks`, `MinimalistHeroProps` и существующая кнопка «Открыть меню».
- Produces: Главная без доступной ссылки «Telegram-канал»; footer-ссылки имеют адаптивный контейнер `hidden md:flex`; мобильная навигация остаётся открываемой кнопкой.

- [ ] **Step 1: Написать падающий тест**

В тесте `configures the homepage with the approved portrait and contacts` заменить позитивную проверку Telegram-канала на поведенческую:

```tsx
expect(screen.queryByRole("link", { name: "Telegram-канал" })).not.toBeInTheDocument();
```

Добавить отдельную проверку визуального адаптивного контракта контейнера иконок:

```tsx
const socialLinks = screen.getByRole("link", { name: "GitHub" }).parentElement;
expect(socialLinks).toHaveClass("hidden");
expect(socialLinks).toHaveClass("md:flex");
```

Этот тест ловит возврат удалённого канала или утрату mobile-first скрытия иконок, не проверяя исходный текст файлов.

- [ ] **Step 2: Запустить тест и убедиться в ожидаемом падении**

Run: `npm test -- tests/components/minimalist-hero.test.tsx`

Expected: FAIL, потому что `HomePage` ещё рендерит ссылку «Telegram-канал», а контейнер социальных иконок не содержит классы `hidden` и `md:flex`.

- [ ] **Step 3: Внести минимальную реализацию**

В `app/page.tsx` удалить ровно эту запись:

```tsx
{ icon: "radio", href: "https://t.me/ai_na_practike", label: "Telegram-канал" },
```

В `components/ui/minimalist-hero.tsx` заменить класс контейнера социальных ссылок:

```tsx
className="flex items-center space-x-4"
```

на:

```tsx
className="hidden items-center space-x-4 md:flex"
```

Не изменять `socialIcons`, кнопку меню или блок локации: тип `radio` остаётся допустимым для переиспользования компонента с другими входными данными.

- [ ] **Step 4: Запустить тест и убедиться в прохождении**

Run: `npm test -- tests/components/minimalist-hero.test.tsx`

Expected: PASS; все четыре теста проходят.

- [ ] **Step 5: Проверить сборку и зафиксировать изменение**

Run: `npm run build`

Expected: exit code 0.

```bash
git add app/page.tsx components/ui/minimalist-hero.tsx tests/components/minimalist-hero.test.tsx
git commit -m "fix: simplify home social links on mobile"
```
