// src/controllers/workspace.controller.js

import { db } from '../config/db.js';


export const createWorkspace = async (req, res) => {
  try {
    const { name, description, category, visibility, imageUrl } = req.body;
    const userId = req.userId;
    


    if (!name) {
      return res.status(400).json({ error: 'Le nom du workspace est obligatoire.' });
    }

    const result = await db.query(
      `INSERT INTO workspaces 
        (name, description, category, visibility, image_url, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [
        name, 
        description || null, 
        category || 'engineering', 
        visibility || 'private', 
        imageUrl || null, 
        userId
      ]
    );

    res.status(201).json({
      message: 'Workspace créé avec succès',
      workspace: result.rows[0],
    });
  } catch (error) {
    console.error('Erreur création workspace:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};


export const getAllWorkspaces = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, description, category, visibility, image_url, created_by, created_at 
       FROM workspaces 
       ORDER BY created_at DESC`
    );
    res.status(200).json({ workspaces: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
};
