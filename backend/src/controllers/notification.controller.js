import { db } from '../config/db.js';
import { NotificationModel } from '../models/notification.model.js';

const ALLOWED_TYPES = NotificationModel?.TYPES || [
  'task_assigned',
  'task_updated',
  'workspace_invite',
];

/**
 * GET /notifications
 * Return current user's notifications + unread count
 */
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 50);
    const offset = Math.max(parseInt(req.query.offset || '0', 10), 0);

    const notificationsResult = await db.query(
      `SELECT id, user_id, type, message, is_read, created_at
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const unreadResult = await db.query(
      `SELECT COUNT(*)::int AS count
       FROM notifications
       WHERE user_id = $1 AND is_read = false`,
      [userId]
    );

    res.status(200).json({
      notifications: notificationsResult.rows,
      unreadCount: unreadResult.rows[0]?.count || 0,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /notifications/unread-count
 * Return only unread count for current user
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await db.query(
      `SELECT COUNT(*)::int AS count
       FROM notifications
       WHERE user_id = $1 AND is_read = false`,
      [userId]
    );

    res.status(200).json({ unreadCount: result.rows[0]?.count || 0 });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PATCH /notifications/:id/read
 * Mark one notification as read (owner only)
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const result = await db.query(
      `UPDATE notifications
       SET is_read = true
       WHERE id = $1 AND user_id = $2
       RETURNING id, user_id, type, message, is_read, created_at`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification marked as read',
      notification: result.rows[0],
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PATCH /notifications/read-all
 * Mark all current user's notifications as read
 */
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await db.query(
      `UPDATE notifications
       SET is_read = true
       WHERE user_id = $1 AND is_read = false
       RETURNING id`,
      [userId]
    );

    res.status(200).json({
      message: 'All notifications marked as read',
      updatedCount: result.rowCount,
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /notifications
 * Create a notification (can be used internally or by protected admin route)
 */
export const createNotification = async (req, res) => {
  try {
    const { userId, type, message } = req.body;

    if (!userId || !type || !message) {
      return res.status(400).json({
        error: 'userId, type and message are required',
      });
    }

    if (!ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({
        error: `Invalid notification type. Allowed: ${ALLOWED_TYPES.join(', ')}`,
      });
    }

    const result = await db.query(
      `INSERT INTO notifications (user_id, type, message, is_read, created_at)
       VALUES ($1, $2, $3, false, NOW())
       RETURNING id, user_id, type, message, is_read, created_at`,
      [userId, type, message]
    );

    res.status(201).json({
      message: 'Notification created successfully',
      notification: result.rows[0],
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
