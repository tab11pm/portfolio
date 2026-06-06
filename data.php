<?php
// data.php

$student = [
  "full_name" => "Шонизоров Т.Г.",
  "birth_date" => "—",
  "photo" => "assets/img/student.jpg",
  "short_bio" => "Я студент ТУСУР и фронтенд-разработчик с двумя годами коммерческого опыта (компания MATRIX IT Tajikistan). Основной стек — React, Next.js, TypeScript, Tailwind CSS; параллельно изучаю Go (Golang) для backend и активно внедряю AI в рабочие процессы. Разрабатываю CRM-системы, маркетплейсы, fintech-решения и Telegram-ботов. Учусь в ТУСУР параллельно с работой.",
  "achievements" => [
    ["year" => "2021", "title" => "Старт работы в MATRIX IT Tajikistan", "details" => "Фронтенд-разработка сайтов, CRM и fintech-решений"],
    ["year" => "2024", "title" => "Изучение Go (Golang) для backend", "details" => "Цель — уверенный middle-level, ~3–4 часа в день"],
    ["year" => "2025", "title" => "Разработка экосистемы Nadim", "details" => "Frontend на React и Tailwind CSS"],
    ["year" => "2026", "title" => "Telegram-канал «тот самый Фронтендер»", "details" => "Авторский контент о фронтенде и буднях разработчика"],
  ],
];

$hobbies = [
  "blogging" => [
    "title" => "Ведение Telegram-канала",
    "image" => "assets/img/hobby_blogging.jpg",
    "short" => "Веду авторский канал «тот самый Фронтендер» про фронтенд и жизнь разработчика.",
    "description" => "Веду Telegram-канал «тот самый Фронтендер» (@tot_samiy_frontend): делюсь опытом фронтенд-разработки, рассказываю про свой рабочий день, новости и инструменты. Регулярный контент дисциплинирует, помогает структурировать знания и объяснять сложные вещи простым языком. Для автоматизации постинга написал собственный MCP-сервер на Python (Bot API + Telethon), который умеет публиковать, редактировать и закреплять посты.",
    "resources" => [
      ["name" => "Telegram «тот самый Фронтендер»", "type" => "Авторский канал", "url" => "https://t.me/tot_samiy_frontend"],
      ["name" => "Telegram Bot API", "type" => "Документация", "url" => "https://core.telegram.org/bots/api"],
      ["name" => "Telethon (MTProto)", "type" => "Библиотека", "url" => "https://docs.telethon.dev/"],
    ],
  ],
  "ai" => [
    "title" => "AI и автоматизация",
    "image" => "assets/img/hobby_ai.jpg",
    "short" => "Внедряю AI в разработку и повседневные задачи, пишу свои MCP-серверы.",
    "description" => "Активно использую AI как напарника в разработке, а не как разовый генератор текста. Пробую новые модели и инструменты, пишу собственные MCP-серверы (Model Context Protocol) для интеграции AI-агентов с Telegram, СДО ТУСУР и личными задачами. Это хобби напрямую усиливает основную работу: ускоряет рутину, помогает быстрее осваивать backend и выходить за рамки чистого фронтенда.",
    "resources" => [
      ["name" => "Model Context Protocol", "type" => "Спецификация", "url" => "https://modelcontextprotocol.io/"],
      ["name" => "Anthropic Claude", "type" => "AI-модель", "url" => "https://www.anthropic.com/"],
      ["name" => "OpenAI Platform", "type" => "Документация", "url" => "https://platform.openai.com/docs"],
    ],
  ],
  "golang" => [
    "title" => "Изучение Go (Golang)",
    "image" => "assets/img/hobby_golang.jpg",
    "short" => "Прокачиваю backend на Go, чтобы выйти на уверенный middle-уровень.",
    "description" => "Изучаю язык Go с целью выйти на уверенный middle-level в backend-разработке. Уделяю обучению примерно 3–4 часа в день: читаю документацию, разбираю чужой код, пишу REST API и применяю Go в реальных проектах (backend Nadim и Smart Marketplace). Go хорошо дополняет мой фронтенд-стек и позволяет делать проекты целиком — от интерфейса до сервера и базы данных.",
    "resources" => [
      ["name" => "A Tour of Go", "type" => "Интерактивный курс", "url" => "https://go.dev/tour/"],
      ["name" => "Go by Example", "type" => "Примеры кода", "url" => "https://gobyexample.com/"],
      ["name" => "Effective Go", "type" => "Документация", "url" => "https://go.dev/doc/effective_go"],
    ],
  ],
];

$projects = [
  [
    "title" => "Nadim — fintech/e-commerce экосистема",
    "image" => "assets/img/project_nadim.jpg",
    "description" => "Большая продуктовая экосистема: оплата в рассрочку, кэшбэк, интернет-магазин, логистика, импорт-экспорт и кассовая система (POS). Frontend на React + Tailwind CSS, backend на Golang.",
    "world_status" => "Fintech и рассрочка (BNPL — Buy Now Pay Later) — один из самых быстрорастущих сегментов рынка. В мире лидируют Klarna, Affirm, Afterpay; в регионе Центральной Азии ниша локальных решений с рассрочкой и кэшбэком пока слабо занята, что даёт пространство для роста.",
    "results" => [
      "Разработан frontend на React и Tailwind CSS.",
      "Реализована кассовая система (POS) с несколькими методами оплаты и расчётом сдачи.",
      "Сделана печать чеков под 80mm термопринтер (моноширинный layout, ширина ~72mm).",
    ],
    "plans" => [
      "Развивать backend на Golang и API экосистемы.",
      "Расширять модули логистики и импорт-экспорта.",
      "Масштабировать кэшбэк и программу лояльности.",
    ],
    "progress" => 80
  ],
  [
    "title" => "Smart Marketplace — трёхсторонний маркетплейс",
    "image" => "assets/img/project_smart.jpg",
    "description" => "Маркетплейс для Таджикистана: продавцы добавляют товары, проверенные консультанты собирают экспертные подборки из их инвентаря, а покупатели берут подборку как единое предложение по финальной цене. Платформа корректно делит оплату между продавцом, консультантом и собой.",
    "world_status" => "Классические маркетплейсы (Amazon, Wildberries, Ozon) перегружают покупателя выбором. Тренд смещается в сторону curated commerce и экспертных подборок, где доверие к консультанту важнее, чем количество карточек товаров. Для локального рынка ПК и периферии это незанятая ниша.",
    "results" => [
      "Завершены фазы 1–6 по методологии GSD (30/30 планов).",
      "Frontend: Next.js App Router, TypeScript, Tailwind CSS, i18n (ru/en/tj).",
      "Backend: NestJS modular monolith + Prisma, PostgreSQL, Redis.",
      "Реализованы checkout, провайдеры оплат (Alif Pay, Korti Milli), ledger балансов и история выплат.",
    ],
    "plans" => [
      "Phase 7 — backend API для операций менеджера.",
      "Phase 8 — frontend-панели менеджера на React.",
      "Phase 9 — деплой на Railway, тесты и запуск.",
    ],
    "progress" => 65
  ],
  [
    "title" => "Black Grill — Telegram mini-app",
    "image" => "assets/img/project_blackgrill.jpg",
    "description" => "Мини-приложение (Telegram mini-app) для ресторанного бизнеса: меню, заказы и взаимодействие с гостем прямо внутри Telegram. Стек: TypeScript, React.",
    "world_status" => "Telegram mini-apps стали полноценной платформой для бизнеса: рестораны и доставка уходят от отдельных мобильных приложений к лёгким web-app внутри мессенджера, где уже есть аудитория и платежи.",
    "results" => [
      "Реализован интерфейс mini-app на React + TypeScript.",
      "Сделано меню и пользовательский сценарий заказа.",
      "Интеграция с Telegram WebApp API.",
    ],
    "plans" => [
      "Подключить онлайн-оплату внутри Telegram.",
      "Добавить админ-панель для управления меню.",
      "Аналитика заказов и пуш-уведомления.",
    ],
    "progress" => 60
  ],
  [
    "title" => "Telegram MCP — собственный AI-инструмент",
    "image" => "assets/img/project_mcp.jpg",
    "description" => "Кастомный MCP-сервер (Model Context Protocol) на Python для управления Telegram-каналом из AI-агента: постинг текста/фото/документов, редактирование, закрепление, чтение истории канала.",
    "world_status" => "MCP (Model Context Protocol) — новый открытый стандарт подключения AI-агентов к внешним инструментам и данным. Экосистема MCP-серверов активно растёт, и собственные интеграции под конкретные задачи становятся нормой для разработчиков, работающих с AI.",
    "results" => [
      "Сервер telegram (Bot API на httpx): постинг, редактирование, закрепление, удаление.",
      "Сервер telegram-user (Telethon/MTProto): чтение и поиск по истории канала.",
      "Подключён в Claude Code, Codex CLI и Windsurf.",
    ],
    "plans" => [
      "Ввести api_id/api_hash и активировать чтение истории.",
      "Добавить планировщик отложенных постов.",
      "Расширить набор инструментов под аналитику канала.",
    ],
    "progress" => 70
  ],
];

function h($s) {
  return htmlspecialchars($s ?? "", ENT_QUOTES, "UTF-8");
}
