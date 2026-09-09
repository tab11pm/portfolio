import { render } from "@testing-library/react";
import { AmbientCanvas } from "@/components/AmbientCanvas";

it("marks decorative canvas as hidden from assistive technology", () => {
  const { container } = render(<AmbientCanvas variant="pixels" />);
  expect(container.querySelector("canvas")).toHaveAttribute("aria-hidden", "true");
});
