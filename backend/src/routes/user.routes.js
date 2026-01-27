import { Router } from 'express';
import { getAllUsers } from '../controllers/user.controller.js';
import { authenticate } from '../middelwares/auth.middleware.js';


const router = Router();

router.get('/', authenticate, getAllUsers);

export default router;