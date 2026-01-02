// src/controllers/workspace.controller.js

import { db } from '../config/db.js';

// Get all workspaces
export const getAllWorkspaces = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, description, created_by, created_at, updated_at
       FROM workspaces
       ORDER BY created_at DESC`
    );

    res.status(200).json({
      workspaces: result.rows,
    });
  } catch (error) {
    console.error('Get workspaces error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get workspace by ID
export const getWorkspaceById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT id, name, description, created_by, created_at, updated_at
       FROM workspaces
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Workspace not found' });
      return;
    }

    res.status(200).json({
      workspace: result.rows[0],
    });
  } catch (error) {
    console.error('Get workspace error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create workspace (admin only)
export const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.userId; // Assurez-vous que middleware auth ajoute req.userId
    const userRole = req.userRole; // Assurez-vous que middleware auth ajoute req.userRole

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (userRole !== 'admin') {
      res.status(403).json({ error: 'Only admin can create workspace' });
      return;
    }

    if (!name) {
      res.status(400).json({ error: 'Workspace name is required' });
      return;
    }

    const result = await db.query(
      `INSERT INTO workspaces (name, description, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id, name, description, created_by, created_at, updated_at`,
      [name, description || null, userId]
    );

    res.status(201).json({
      message: 'Workspace created successfully',
      workspace: result.rows[0],
    });
  } catch (error) {
    console.error('Create workspace error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update workspace (admin only)
export const updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userRole = req.userRole;

    if (userRole !== 'admin') {
      res.status(403).json({ error: 'Only admin can update workspace' });
      return;
    }

    if (!name && description === undefined) {
      res.status(400).json({ error: 'At least one field (name or description) is required' });
      return;
    }

    const updateFields = [];
    const values = [];

    if (name) {
      updateFields.push('name = $1');
      values.push(name);
    }

    if (description !== undefined) {
      const paramNumber = values.length + 1;
      updateFields.push(`description = $${paramNumber}`);
      values.push(description ?? null);
    }

    // Always update timestamp
    updateFields.push('updated_at = NOW()');

    const idParam = values.length + 1;
    values.push(id);

    const query = `
      UPDATE workspaces
      SET ${updateFields.join(', ')}
      WHERE id = $${idParam}
      RETURNING id, name, description, created_by, created_at, updated_at
    `;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Workspace not found' });
      return;
    }

    res.status(200).json({
      message: 'Workspace updated successfully',
      workspace: result.rows[0],
    });
  } catch (error) {
    console.error('Update workspace error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete workspace (admin only)
export const deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.userRole;

    if (userRole !== 'admin') {
      res.status(403).json({ error: 'Only admin can delete workspace' });
      return;
    }

    const result = await db.query(
      'DELETE FROM workspaces WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Workspace not found' });
      return;
    }

    res.status(200).json({
      message: 'Workspace deleted successfully',
    });
  } catch (error) {
    console.error('Delete workspace error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
