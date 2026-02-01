import { Router } from 'express';
import {
  getTasksByWorkspace,
  getTaskById,
  getOwnTasks,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
  addComment,
  getTaskComments,
} from '../controllers/task.controller.js';



import { authenticate } from '../middelwares/auth.middleware.js';

const router = Router();

// 🔐 PROTECTED ROUTES
router.get('/my-tasks', authenticate, getOwnTasks);

router.get('/workspace/:workspaceId', authenticate, getTasksByWorkspace);
router.get('/workspace/:workspaceId/status/:status', authenticate, getTasksByStatus);

router.get('/:id', authenticate, getTaskById);

router.post('/', authenticate, createTask);
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);

router.post('/:id/comments', authenticate, addComment);
router.get('/:id/comments', authenticate, getTaskComments);

export default router;
