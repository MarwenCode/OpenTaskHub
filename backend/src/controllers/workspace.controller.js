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
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
};




/**
 * Get members of a workspace
 */
export const getWorkspaceMembers = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // First, check if the workspace exists
    const workspaceCheck = await db.query(
      'SELECT id FROM workspaces WHERE id = $1',
      [workspaceId]
    );

    if (workspaceCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Get all members of the workspace
    // Assuming you have a workspace_members table or similar
    // Adjust the query based on your database schema
    const result = await db.query(
      `SELECT DISTINCT u.id, u.username, u.email 
       FROM users u
       INNER JOIN workspace_members wm ON u.id = wm.user_id
       WHERE wm.workspace_id = $1
       ORDER BY u.username ASC`,
      [workspaceId]
    );

    res.status(200).json({ members: result.rows });
  } catch (error) {
    console.error('Get workspace members error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// If you don't have a workspace_members table yet, use this alternative:
// This gets the workspace creator plus any users who have created tasks in the workspace
export const getWorkspaceMembersAlternative = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const result = await db.query(
      `SELECT DISTINCT u.id, u.username, u.email 
       FROM users u
       WHERE u.id IN (
         SELECT created_by FROM workspaces WHERE id = $1
         UNION
         SELECT created_by FROM tasks WHERE workspace_id = $1
         UNION
         SELECT assigned_to FROM tasks WHERE workspace_id = $1 AND assigned_to IS NOT NULL
       )
       ORDER BY u.username ASC`,
      [workspaceId]
    );

    res.status(200).json({ members: result.rows });
  } catch (error) {
    console.error('Get workspace members error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};