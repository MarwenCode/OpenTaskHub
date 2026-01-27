// controllers/user.controller.js
import { db } from '../config/db.js';
// That's it! No model import needed

/**
 * Get all users
 */
export const getAllUsers = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, email FROM users ORDER BY username ASC'
    );

    res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};