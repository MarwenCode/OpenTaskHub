// controllers/auth.controller.js
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

    // Génère le token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const register = async (req, res) => {
  const { username, email, password } = req.body;

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
     VALUES ($1,$2,$3,'user',NOW())
     RETURNING id, username, email, role`,
    [username, email, hashed]
  );

  res.status(201).json(result.rows[0]);
};



export const createAdmin = async (req, res) => {
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  const result = await db.query(
    `INSERT INTO users (username,email,password,role,created_at)
     VALUES ($1,$2,$3,'admin',NOW())
     RETURNING id, username, email, role`,
    [username, email, hashed]
  );

  res.status(201).json(result.rows[0]);
};
