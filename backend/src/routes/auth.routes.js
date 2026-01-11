import express from 'express';
import { login, register } from '../controllers/auth.controller.js';

const router = express.Router();

// --- ROUTES D'INSCRIPTION (REGISTER) ---
router.post('/register/user', (req, res, next) => {
    req.roleToAssign = 'user'; 
    next();
}, register);

router.post('/register/admin', (req, res, next) => {
    req.roleToAssign = 'admin'; 
    next();
}, register);

// --- ROUTES DE CONNEXION (LOGIN) ---
router.post('/login/user', (req, res, next) => {
    req.expectedRole = 'user'; 
    next();
}, login);

router.post('/login/admin', (req, res, next) => {
    req.expectedRole = 'admin'; 
    next();
}, login);

export default router;