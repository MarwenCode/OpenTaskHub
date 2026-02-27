import { jest } from "@jest/globals";
import { db } from "../../../src/config/db.js";
import { createTask } from "../../../src/controllers/task.controller.js";

const createResponseMock = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe("task.controller", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("createTask", () => {
    it("returns 400 when status is invalid", async () => {
      const req = {
        body: {
          title: "Task 1",
          workspaceId: "ws-1",
          status: "invalid_status",
        },
        userId: "u-1",
      };
      const res = createResponseMock();
      const querySpy = jest.spyOn(db, "query");

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "status must be one of: todo, in_progress, done",
      });
      expect(querySpy).not.toHaveBeenCalled();
    });

    it("creates task successfully", async () => {
      const req = {
        body: {
          title: "Task 1",
          description: "Description",
          status: "todo",
          workspaceId: "ws-1",
        },
        userId: "u-1",
      };
      const res = createResponseMock();
      const createdTask = {
        id: "t-1",
        title: "Task 1",
        description: "Description",
        status: "todo",
        workspace_id: "ws-1",
        assigned_to: null,
        created_by: "u-1",
      };
      const querySpy = jest.spyOn(db, "query").mockResolvedValue({
        rows: [createdTask],
      });

      await createTask(req, res);

      expect(querySpy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Task created successfully",
        task: createdTask,
      });
    });
  });
});
