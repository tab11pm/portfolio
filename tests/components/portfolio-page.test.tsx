import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import PortfolioPage from "@/app/portfolio/page";

vi.mock("@paper-design/shaders-react", () => ({
  Warp: () => <div data-testid="warp" />,
}));

it("renders the approved portfolio route through the shader-card grid", () => {
  render(<PortfolioPage />);

  expect(screen.getByRole("heading", { level: 1, name: "Работы, за которыми стоит результат." })).toBeInTheDocument();
  expect(screen.getAllByRole("article")).toHaveLength(4);
  expect(screen.getAllByTestId("warp")).toHaveLength(4);
});
