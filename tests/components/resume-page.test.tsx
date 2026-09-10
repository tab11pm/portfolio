import { render, screen, within } from "@testing-library/react";
import ResumePage from "@/app/resume/page";

it("renders the approved Core Matrix résumé cards in display order", () => {
  const { container } = render(<ResumePage />);

  expect(screen.getByRole("heading", { level: 1, name: "Опыт, системность, рост." })).toBeInTheDocument();

  const deck = screen.getByRole("region", { name: "Опыт работы" });
  const cards = Array.from(container.querySelectorAll(".resume-deck > article"));
  expect(cards).toHaveLength(4);
  expect(cards.map((card) => card.className)).toEqual([
    "resume-card resume-card--lead resume-reveal is-active",
    "resume-card resume-card--side resume-reveal",
    "resume-card resume-card--lower resume-reveal",
    "resume-card resume-card--editorial resume-reveal",
  ]);
  expect(deck).toHaveClass("resume-deck");
  expect(deck).toHaveAttribute("aria-roledescription", "колода карточек");
  expect(deck).toHaveAttribute("tabindex", "0");
  expect(cards.every((card) => card.classList.contains("resume-reveal"))).toBe(true);
  expect(container.querySelectorAll(".resume-parallax")).toHaveLength(0);

  expect(within(cards[0]).getByText("PinShop TJ")).toBeInTheDocument();
  expect(within(cards[0]).getByText("2026—сейчас")).toBeInTheDocument();
  expect(within(cards[1]).getByText("Matrix IT")).toBeInTheDocument();
  expect(within(cards[1]).getByText("2024—2026")).toBeInTheDocument();
  expect(within(cards[2]).getByText("ТУСУР")).toBeInTheDocument();
  expect(within(cards[2]).getByText("2024—2028")).toBeInTheDocument();
  expect(within(cards[3]).getByText("Строю продукты и беру ответственность за систему.")).toBeInTheDocument();
});
