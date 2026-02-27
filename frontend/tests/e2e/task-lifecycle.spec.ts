import { expect, test } from "@playwright/test";

type MockTask = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  workspace_id: string;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

test("user can login, create a task, see it, then delete it", async ({ page }) => {
  const workspaceId = "ws-1";
  const userId = "u-1";
  let tasks: MockTask[] = [];

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const method = request.method();
    const pathname = url.pathname;

    if (pathname === "/api/auth/login/user" && method === "POST") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          token: "mock-jwt-token",
          user: {
            id: userId,
            username: "demo-user",
            email: "demo@example.com",
            role: "user",
          },
        }),
      });
    }

    if (pathname === "/api/workspaces" && method === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: workspaceId,
            name: "Demo Workspace",
            description: "Workspace for e2e tests",
            category: "engineering",
            visibility: "private",
          },
        ]),
      });
    }

    if (pathname === "/api/users" && method === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          users: [{ id: userId, username: "demo-user", email: "demo@example.com" }],
        }),
      });
    }

    if (pathname === "/api/notifications" && method === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          notifications: [],
          unreadCount: 0,
        }),
      });
    }

    if (
      (pathname === "/api/notifications/read-all" && method === "PATCH") ||
      (/^\/api\/notifications\/[^/]+\/read$/.test(pathname) && method === "PATCH")
    ) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "ok" }),
      });
    }

    if (pathname === `/api/tasks/workspace/${workspaceId}` && method === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ tasks }),
      });
    }

    if (pathname === "/api/tasks" && method === "POST") {
      const payload = request.postDataJSON() as {
        title: string;
        description?: string;
        status?: "todo" | "in_progress" | "done";
        workspaceId: string;
        assignedTo?: string;
      };
      const now = new Date().toISOString();
      const createdTask: MockTask = {
        id: `task-${Date.now()}`,
        title: payload.title,
        description: payload.description || "",
        status: payload.status || "todo",
        workspace_id: payload.workspaceId,
        assigned_to: payload.assignedTo || null,
        created_by: userId,
        created_at: now,
        updated_at: now,
      };
      tasks = [createdTask, ...tasks];

      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Task created successfully",
          task: createdTask,
        }),
      });
    }

    if (/^\/api\/tasks\/[^/]+$/.test(pathname) && method === "DELETE") {
      const taskId = pathname.split("/").pop() as string;
      tasks = tasks.filter((task) => task.id !== taskId);

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Task deleted successfully" }),
      });
    }

    if (/^\/api\/tasks\/[^/]+\/comments$/.test(pathname) && method === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ comments: [] }),
      });
    }

    return route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({ error: `No mock for ${method} ${pathname}` }),
    });
  });

  const taskTitle = `E2E Task ${Date.now()}`;

  await page.goto("/login");
  await page.getByPlaceholder("name@company.com").fill("demo@example.com");
  await page.getByPlaceholder("Enter your password").fill("secret123");
  await page.getByRole("button", { name: /log in/i }).click();

  await expect(page.getByText("Demo Workspace")).toBeVisible();
  await page.getByText("Demo Workspace").click();

  await expect(page).toHaveURL(new RegExp(`/workspace/${workspaceId}`));
  await page.getByRole("button", { name: /new ticket/i }).click();

  await page.getByLabel(/title/i).fill(taskTitle);
  await page.getByLabel(/description/i).fill("Task created from Playwright test");
  await page.getByRole("button", { name: /create ticket/i }).click();

  await expect(page.getByRole("heading", { name: taskTitle })).toBeVisible();

  await page.getByRole("heading", { name: taskTitle }).click();
  await page.getByTitle("Delete task").click();

  await expect(page.getByRole("heading", { name: taskTitle })).not.toBeVisible();
});
