/**
 * Task model
 * Represents a task in a workspace
 */

export const TaskModel = {
  id: null,           // string, UUID
  title: null,        // string
  description: null,  // optional string
  status: 'todo',     // 'todo', 'in_progress', 'done'
  workspaceId: null,  // string, workspace ID
  assignedTo: null,   // string, user ID (optional)
  createdBy: null,    // string, user ID
  createdAt: new Date(),
  updatedAt: new Date(),
  TASK_STATUSES: ['todo', 'in_progress', 'done'], // allowed statuses
};
