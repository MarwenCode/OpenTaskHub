
import express from 'express';
import { login, register } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', login);

// Route pour utilisateur simple
router.post('/register/user', (req, res, next) => {
    req.userRoleToAssign = 'user';
    next();
}, register);

// Route pour admin
router.post('/register/admin', (req, res, next) => {
    req.userRoleToAssign = 'admin';
    next();
}, register);

export default router;