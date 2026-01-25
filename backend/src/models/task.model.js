/**
 * Task model
 */
export const TaskModel = {
  id: null,           // string (UUID)
  title: null,        // string
  description: null,  // string
  status: 'todo',     // 'todo', 'in_progress', 'done'
  workspaceId: null,  // string (UUID)
  assignedTo: null,   // string (UUID)
  createdBy: null,    // string (UUID)
  createdAt: new Date(),
  updatedAt: new Date(),
  STATUSES: ['todo', 'in_progress', 'done'],
};