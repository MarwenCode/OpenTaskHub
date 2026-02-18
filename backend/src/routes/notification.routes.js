import { Router } from 'express';
import {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
} from '../controllers/notification.controller.js';
import { authenticate } from '../middelwares/auth.middleware.js';
import { isAdmin } from '../middelwares/admin.middleware.js';

const router = Router();

// Authenticated user routes
router.get('/', authenticate, getMyNotifications);
router.get('/unread-count', authenticate, getUnreadCount);
router.patch('/read-all', authenticate, markAllNotificationsAsRead);
router.patch('/:id/read', authenticate, markNotificationAsRead);

// Admin-only route (manual notification creation)
router.post('/', authenticate, isAdmin, createNotification);

export default router;
