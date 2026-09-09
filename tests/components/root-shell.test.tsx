import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";
import { vi } from "vitest";

const pathname = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({ usePathname: pathname }));

it("keeps the shared landmark shell on secondary routes", () => {
  pathname.mockReturnValue("/portfolio");
  render(<RootLayout><p>Страница</p></RootLayout>);
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByRole("main")).toHaveTextContent("Страница");
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
});

it("does not duplicate the homepage hero chrome", () => {
  pathname.mockReturnValue("/");
  render(<RootLayout><p>Главная</p></RootLayout>);

  expect(screen.getByRole("main")).toHaveTextContent("Главная");
  expect(screen.queryByRole("banner")).not.toBeInTheDocument();
  expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
});
