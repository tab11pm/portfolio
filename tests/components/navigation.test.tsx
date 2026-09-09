import { render, screen } from "@testing-library/react";
import { Header } from "@/components/Header";

it("links visitors to all three public pages", () => {
  render(<Header />);
  expect(screen.getByRole("link", { name: "Главная" })).toHaveAttribute("href", "/");
  expect(screen.getByRole("link", { name: "Резюме" })).toHaveAttribute("href", "/resume");
  expect(screen.getByRole("link", { name: "Портфолио" })).toHaveAttribute("href", "/portfolio");
});
