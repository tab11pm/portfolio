export type Project = {
  slug: "nadim" | "pinshop" | "moodle-math-mcp" | "sdo-mcp";
  title: string;
  category: string;
  summary: string;
  technologies: readonly string[];
  href?: string;
};

export const projects: readonly Project[] = [
  { slug: "nadim", title: "Nadim", category: "Fintech / CRM", summary: "Frontend-разработка экосистемы Nadim: кассовые интерфейсы, роли и интеграции.", technologies: ["React", "TypeScript", "Tailwind CSS"] },
  { slug: "pinshop", title: "PinShop TJ", category: "E-commerce", summary: "Локализованный сервис покупки товаров из Китая. Проект находится в тестировании.", technologies: ["Next.js", "TypeScript", "NestJS"] },
  { slug: "moodle-math-mcp", title: "Moodle Math MCP", category: "MCP / Автоматизация", summary: "MCP-сервер для работы с курсами, материалами и заданиями Moodle Math ТУСУР через Playwright.", technologies: ["TypeScript", "Playwright", "MCP"], href: "https://github.com/tab11pm/moodle_math_mcp" },
  { slug: "sdo-mcp", title: "SDO MCP", category: "MCP / Автоматизация", summary: "Локальный MCP-сервер для авторизации, работы с курсами и материалами СДО ТУСУР.", technologies: ["TypeScript", "Playwright", "MCP"], href: "https://github.com/tab11pm/sdo-mcp" },
];
