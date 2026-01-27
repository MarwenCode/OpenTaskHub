import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

// --- FONCTION REGISTER ---
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const role = req.roleToAssign; // 'user' ou 'admin' selon l'URL appelée

    // Hachage et insertion en base
    const hashed = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (username, email, password, role, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING id, username, email, role`,
      [username, email, hashed, role]
    );

    res.status(201).json({ message: `Compte ${role} créé`, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
};

// --- FONCTION LOGIN ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const expectedRole = req.expectedRole; // 'user' ou 'admin' selon l'URL appelée

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalide' });

    const user = result.rows[0];

    // SÉCURITÉ : On vérifie si le rôle en base correspond à l'URL de connexion
    // Modification: Allow login regardless of route (Unified Login)
    // if (user.role !== expectedRole) {
    //   return res.status(403).json({ error: `Veuillez utiliser le portail ${user.role} pour vous connecter.` });
    // }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalide' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};