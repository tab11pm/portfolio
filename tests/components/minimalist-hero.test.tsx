import { fireEvent, render, screen } from "@testing-library/react";
import { BriefcaseBusiness, Code2, Mail, MessageCircle, Radio } from "lucide-react";
import { MinimalistHero } from "@/components/ui/minimalist-hero";

const props = {
  logoText: "ТШ",
  navLinks: [
    { label: "Главная", href: "/" },
    { label: "Резюме", href: "/resume" },
    { label: "Портфолио", href: "/portfolio" },
  ],
  mainText: "Разработчик, который соединяет продуктовый подход и интерфейсы.",
  readMoreLink: "/portfolio",
  imageSrc: "/images/hero-portrait.png",
  imageAlt: "Портрет Табреза Шонизорова",
  overlayText: { part1: "Создаю понятные", part2: "цифровые продукты." },
  socialLinks: [
    { icon: Code2, href: "https://github.com/tab11pm/", label: "GitHub" },
    { icon: MessageCircle, href: "https://t.me/tab_dev", label: "Telegram" },
    { icon: BriefcaseBusiness, href: "https://www.linkedin.com/in/tabrez-shonizorov-48043434b/", label: "LinkedIn" },
    { icon: Radio, href: "https://t.me/ai_na_practike", label: "Telegram-канал" },
    { icon: Mail, href: "mailto:tabrez.frontend@gmail.com", label: "Email" },
  ],
  locationText: "Томск, Россия",
};

it("renders the supplied hero content and destinations", () => {
  render(<MinimalistHero {...props} />);

  expect(screen.getByText("ТШ")).toBeInTheDocument();
  expect(screen.getByText(props.mainText)).toBeInTheDocument();
  expect(screen.getByRole("heading")).toHaveTextContent("Создаю понятныецифровые продукты.");
  expect(screen.getByRole("link", { name: "Смотреть работы" })).toHaveAttribute("href", "/portfolio");
  expect(screen.getByRole("img", { name: props.imageAlt })).toBeInTheDocument();
  expect(screen.getByText("Томск, Россия")).toBeInTheDocument();
});

it("keeps navigation and contact destinations accessible", () => {
  render(<MinimalistHero {...props} />);

  expect(screen.getAllByRole("link", { name: "Портфолио" })[0]).toHaveAttribute("href", "/portfolio");
  expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/tab11pm/");
  expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("target", "_blank");
  expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:tabrez.frontend@gmail.com");
  expect(screen.getByRole("link", { name: "Email" })).not.toHaveAttribute("target");
});

it("opens the mobile navigation on demand", () => {
  render(<MinimalistHero {...props} />);

  expect(screen.queryByRole("navigation", { name: "Мобильная навигация" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Открыть меню" }));
  expect(screen.getByRole("navigation", { name: "Мобильная навигация" })).toBeVisible();
});
