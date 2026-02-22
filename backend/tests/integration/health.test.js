// Test framework: Jest + Supertest
// Scope: Integration test (route Express via app, sans lancer server.js)
import request from "supertest";
import app from "../../src/app.js";

describe("GET /api/health", () => {
  it("returns 200 and health payload", async () => {
    // Appel HTTP simulé sur l'app Express
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: "OK",
      })
    );
    expect(typeof response.body.timestamp).toBe("string");
    expect(typeof response.body.env).toBe("string");
  });
});
