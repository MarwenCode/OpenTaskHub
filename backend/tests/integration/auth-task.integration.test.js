import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../../src/app.js";
import { db } from "../../src/config/db.js";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";

const clearDatabase = async () => {
  await db.query("DELETE FROM notifications");
  await db.query("DELETE FROM comments");
  await db.query("DELETE FROM tasks");
  await db.query("DELETE FROM workspace_members");
  await db.query("DELETE FROM workspaces");
  await db.query("DELETE FROM users");
};

describe("Auth + Task integration", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await db.end();
  });

  it("logs in and returns a valid JWT token", async () => {
    const hashedPassword = await bcrypt.hash("secret123", 10);
    const userResult = await db.query(
      `INSERT INTO users (username, email, password, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, email`,
      ["integration-user", "integration-login@example.com", hashedPassword, "user"]
    );
    const createdUser = userResult.rows[0];

    const response = await request(app).post("/api/auth/login/user").send({
      email: "integration-login@example.com",
      password: "secret123",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toEqual(
      expect.objectContaining({
        username: "integration-user",
        role: "user",
      })
    );

    const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
    expect(decoded).toEqual(
      expect.objectContaining({
        id: createdUser.id,
        role: "user",
      })
    );
  });

  it("creates a task through Express route and persists it in PostgreSQL", async () => {
    const hashedPassword = await bcrypt.hash("secret123", 10);
    const userResult = await db.query(
      `INSERT INTO users (username, email, password, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id`,
      ["task-owner", "integration-task@example.com", hashedPassword, "user"]
    );
    const userId = userResult.rows[0].id;

    const workspaceResult = await db.query(
      `INSERT INTO workspaces (name, description, owner_id, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id`,
      ["Integration Workspace", "Workspace for integration tests", userId]
    );
    const workspaceId = workspaceResult.rows[0].id;

    const token = jwt.sign({ id: userId, role: "user" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Integration Task",
        description: "Created from integration test",
        status: "todo",
        workspaceId,
      });

    expect(response.status).toBe(201);
    expect(response.body.task).toEqual(
      expect.objectContaining({
        title: "Integration Task",
        workspace_id: workspaceId,
      })
    );

    const persistedTask = await db.query("SELECT * FROM tasks WHERE id = $1", [
      response.body.task.id,
    ]);
    expect(persistedTask.rows.length).toBe(1);
    expect(persistedTask.rows[0]).toEqual(
      expect.objectContaining({
        title: "Integration Task",
        workspace_id: workspaceId,
        created_by: userId,
      })
    );
  });
});
