import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { projects } from "@/data/projects";
import FeaturesCards, { ShaderErrorBoundary } from "@/components/ui/feature-shader-cards";

vi.mock("@paper-design/shaders-react", () => ({
  Warp: ({ speed, colors }: { speed: number; colors: string[] }) => (
    <div data-colors={colors.join(",")} data-speed={speed} data-testid="warp" />
  ),
}));

it("renders each approved project over its own continuously animated Warp", () => {
  render(<FeaturesCards projects={projects} />);

  const shaders = screen.getAllByTestId("warp");

  expect(screen.getAllByRole("article")).toHaveLength(4);
  expect(shaders).toHaveLength(4);
  expect(shaders.every((shader) => shader.dataset.speed === "0.8")).toBe(true);
  expect(new Set(shaders.map((shader) => shader.dataset.colors)).size).toBe(4);
  expect(screen.getByText("Nadim")).toBeInTheDocument();
  expect(screen.getByText("PinShop TJ")).toBeInTheDocument();
});

it("keeps external links limited to the two approved MCP projects", () => {
  render(<FeaturesCards projects={projects} />);

  expect(screen.queryByRole("link", { name: "Открыть проект Nadim" })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Открыть проект PinShop TJ" })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Открыть проект Moodle Math MCP" })).toHaveAttribute(
    "href",
    "https://github.com/tab11pm/moodle_math_mcp",
  );
  expect(screen.getByRole("link", { name: "Открыть проект SDO MCP" })).toHaveAttribute(
    "href",
    "https://github.com/tab11pm/sdo-mcp",
  );
});

it("keeps the project layer visible when a shader cannot render", () => {
  const BrokenShader = () => {
    throw new Error("WebGL unavailable");
  };

  render(
    <ShaderErrorBoundary>
      <BrokenShader />
    </ShaderErrorBoundary>,
  );

  expect(screen.getByTestId("shader-fallback")).toBeInTheDocument();
});
