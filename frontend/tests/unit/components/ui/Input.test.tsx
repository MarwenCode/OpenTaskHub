// Test framework: Jest + React Testing Library
// Scope: Unit test frontend (composant isolé)
import { fireEvent, render, screen } from "@testing-library/react";
import Input from "../../../../src/components/ui/Input";

describe("Input", () => {
  it("renders with placeholder and updates value", () => {
    const handleChange = jest.fn();

    render(
      <Input
        type="email"
        placeholder="name@company.com"
        value=""
        onChange={handleChange}
      />
    );

    // Simulation d'une saisie utilisateur
    const input = screen.getByPlaceholderText("name@company.com");
    fireEvent.change(input, { target: { value: "john@doe.com" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
