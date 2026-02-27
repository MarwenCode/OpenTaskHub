import {
  validateLoginInput,
  validateRegisterInput,
  validateTaskInput,
} from "../../../src/utils/validators.js";

describe("validators", () => {
  describe("validateRegisterInput", () => {
    it("returns null for valid payload", () => {
      const result = validateRegisterInput({
        username: "john",
        email: "john@example.com",
        password: "secret123",
      });

      expect(result).toBeNull();
    });

    it("returns error when email is invalid", () => {
      const result = validateRegisterInput({
        username: "john",
        email: "invalid-email",
        password: "secret123",
      });

      expect(result).toBe("A valid email is required");
    });
  });

  describe("validateLoginInput", () => {
    it("returns null for valid credentials", () => {
      const result = validateLoginInput({
        email: "john@example.com",
        password: "secret123",
      });

      expect(result).toBeNull();
    });

    it("returns error when password is missing", () => {
      const result = validateLoginInput({
        email: "john@example.com",
      });

      expect(result).toBe("Password is required");
    });
  });

  describe("validateTaskInput", () => {
    it("returns null for valid task payload", () => {
      const result = validateTaskInput({
        title: "My task",
        workspaceId: "workspace-1",
        status: "todo",
      });

      expect(result).toBeNull();
    });

    it("returns error when status is invalid", () => {
      const result = validateTaskInput({
        title: "My task",
        workspaceId: "workspace-1",
        status: "invalid",
      });

      expect(result).toBe("status must be one of: todo, in_progress, done");
    });
  });
});
