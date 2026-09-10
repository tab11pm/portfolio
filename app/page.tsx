import { MinimalistHero } from "@/components/ui/minimalist-hero";

export default function HomePage() {
  return <MinimalistHero
    logoText="ТШ"
    navLinks={[
      { label: "Главная", href: "/" },
      { label: "Резюме", href: "/resume" },
      { label: "Портфолио", href: "/portfolio" },
    ]}
    mainText="Табрез Шонизоров — разработчик, который соединяет продуктовый подход, интерфейсы и инженерную системность."
    readMoreLink="/portfolio"
    imageSrc="/images/hero-portrait.png"
    imageAlt="Портрет Табреза Шонизорова"
    overlayText={{ part1: "Создаю понятные", part2: "цифровые продукты." }}
    socialLinks={[
      { icon: "code", href: "https://github.com/tab11pm/", label: "GitHub" },
      { icon: "message", href: "https://t.me/tab_dev", label: "Telegram" },
      { icon: "briefcase", href: "https://www.linkedin.com/in/tabrez-shonizorov-48043434b/", label: "LinkedIn" },
      { icon: "mail", href: "mailto:tabrez.frontend@gmail.com", label: "Email" },
    ]}
    locationText="Томск, Россия"
  />;
}
