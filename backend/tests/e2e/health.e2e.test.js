// Test framework: Jest (mode E2E backend)
// Scope: End-to-end HTTP réel (on démarre un vrai serveur sur un port random)
import app from "../../src/app.js";

describe("Backend e2e health check", () => {
  let server;
  let baseUrl;

  beforeAll(async () => {
    // Lance réellement l'API (comme en prod, mais en local)
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it("responds with HTTP 200 on /api/health", async () => {
    // Requête HTTP réelle via fetch
    const response = await fetch(`${baseUrl}/api/health`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("OK");
    expect(typeof body.timestamp).toBe("string");
  });
});
