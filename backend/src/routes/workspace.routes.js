import { Router } from 'express';

import {
  getAllWorkspaces,
  // getWorkspaceById,
  createWorkspace,
  // updateWorkspace,
  // deleteWorkspace,
} from '../controllers/workspace.controller.js';
import { isAdmin } from '../middelwares/admin.middleware.js';
import { authenticate } from '../middelwares/auth.middleware.js';


const router = Router();

// Authenticated users
router.get('/', authenticate, getAllWorkspaces);
// router.get('/:id', authenticate, getWorkspaceById);

// ADMIN ONLY
router.post('/', authenticate, isAdmin, createWorkspace);
// router.put('/:id', authenticate, isAdmin, updateWorkspace);
// router.delete('/:id', authenticate, isAdmin, deleteWorkspace);

export default router;
