import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

it("renders landmark shell around child content", () => {
  render(<RootLayout><p>Страница</p></RootLayout>);
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByRole("main")).toHaveTextContent("Страница");
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
});
