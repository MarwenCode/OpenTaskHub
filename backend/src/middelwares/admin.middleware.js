// src/middlewares/admin.middleware.js
import { db } from '../config/db.js';

export const isAdmin = async (req, res, next) => {
  try {
    // Récupérer le user depuis la DB avec son userId
    const result = await db.query(
      'SELECT role FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};