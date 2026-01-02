import { Router } from 'express';
import { register, login, createAdmin } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// TEMPORAIRE – création admin protégée par secret
router.post('/create-admin', createAdmin);

export default router;
