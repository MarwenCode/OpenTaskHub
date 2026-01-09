import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query(
      'SELECT id, username, email, password, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Invalid email or password' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Augmenté à 24h pour le confort en dev
    );

    res.json({ 
      message: 'Login successful', 
      token, 
      user: { id: user.id, username: user.username, role: user.role } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fonction unique pour gérer l'inscription
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // On récupère le rôle passé par le middleware de route (voir fichier routes)
    const role = req.userRoleToAssign || 'user'; 

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const exists = await db.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (exists.rows.length) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (username, email, password, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, username, email, role`,
      [username, email, hashed, role]
    );

    res.status(201).json({
      message: `${role === 'admin' ? 'Admin' : 'User'} created successfully`,
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};