import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import { db } from "../../../src/config/db.js";
import { login, register } from "../../../src/controllers/auth.controller.js";

const createResponseMock = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe("auth.controller", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("register", () => {
    it("returns 400 when payload is invalid", async () => {
      const req = {
        body: { username: "john", email: "invalid", password: "secret123" },
        roleToAssign: "user",
      };
      const res = createResponseMock();

      const querySpy = jest.spyOn(db, "query");

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "A valid email is required",
      });
      expect(querySpy).not.toHaveBeenCalled();
    });

    it("creates account when payload is valid", async () => {
      const req = {
        body: {
          username: "john",
          email: "john@example.com",
          password: "secret123",
        },
        roleToAssign: "user",
      };
      const res = createResponseMock();

      jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed-password");
      jest.spyOn(db, "query").mockResolvedValue({
        rows: [{ id: "u-1", username: "john", email: "john@example.com", role: "user" }],
      });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Compte user créé",
        user: { id: "u-1", username: "john", email: "john@example.com", role: "user" },
      });
    });
  });

  describe("login", () => {
    it("returns 401 when user is not found", async () => {
      const req = {
        body: { email: "ghost@example.com", password: "secret123" },
        expectedRole: "user",
      };
      const res = createResponseMock();

      jest.spyOn(db, "query").mockResolvedValue({ rows: [] });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalide" });
    });

    it("returns JWT payload on success", async () => {
      const req = {
        body: { email: "john@example.com", password: "secret123" },
        expectedRole: "user",
      };
      const res = createResponseMock();

      jest.spyOn(db, "query").mockResolvedValue({
        rows: [
          {
            id: "u-1",
            email: "john@example.com",
            username: "john",
            password: "hashed-password",
            role: "user",
          },
        ],
      });
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
      jest.spyOn(jwt, "sign").mockReturnValue("jwt-token");

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        token: "jwt-token",
        user: { username: "john", role: "user" },
      });
    });
  });
});
