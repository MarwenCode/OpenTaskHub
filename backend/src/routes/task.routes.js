import { Router } from 'express';
import {
  getTasksByWorkspace,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
} from '../controllers/task.controller.js';

const router = Router();

// All task routes require authentication

// Get all tasks in a workspace
router.get('/workspace/:workspaceId', getTasksByWorkspace);

// Get tasks by status in a workspace (todo, in_progress, done)
router.get('/workspace/:workspaceId/status/:status', getTasksByStatus);

// Get task by ID
router.get('/:id', getTaskById);

// Create task
router.post('/', createTask);

// Update task
router.put('/:id', updateTask);

// Delete task
router.delete('/:id', deleteTask);

export default router;
