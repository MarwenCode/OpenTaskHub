// Test framework: Jest
// Scope: Unit test (middleware isolé, sans serveur HTTP réel)
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import { authenticate } from "../../src/middelwares/auth.middleware.js";

describe("authenticate middleware", () => {
  afterEach(() => {
    // Nettoie les mocks entre les tests
    jest.restoreAllMocks();
  });

  it("returns 401 when authorization header is missing", () => {
    // Requête simulée sans header Authorization
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token missing" });
    expect(next).not.toHaveBeenCalled();
  });

  it("sets user info and calls next when token is valid", () => {
    // On mock jwt.verify pour rester en test unitaire (pas de vraie vérification crypto)
    jest.spyOn(jwt, "verify").mockReturnValue({ id: "u-1", role: "admin" });

    const req = { headers: { authorization: "Bearer valid-token" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authenticate(req, res, next);

    expect(req.userId).toBe("u-1");
    expect(req.userRole).toBe("admin");
    expect(next).toHaveBeenCalledTimes(1);
  });
});
