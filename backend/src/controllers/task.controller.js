import { db } from '../config/db.js';

/**
 * Get all tasks in a workspace
 */
export const getTasksByWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Verify workspace exists
    const workspaceCheck = await db.query(
      'SELECT id FROM workspaces WHERE id = $1',
      [workspaceId]
    );

    if (workspaceCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    const result = await db.query(
      `SELECT id, title, description, status, workspace_id,
              assigned_to, created_by, created_at, updated_at
       FROM tasks
       WHERE workspace_id = $1
       ORDER BY created_at DESC`,
      [workspaceId]
    );

    res.status(200).json({ tasks: result.rows });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get task by ID
 */
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT id, title, description, status, workspace_id,
              assigned_to, created_by, created_at, updated_at
       FROM tasks
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ task: result.rows[0] });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Create task
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, status, workspaceId, assignedTo } = req.body;
    const userId = req.user.id; // from JWT middleware

    if (!title || !workspaceId) {
      return res.status(400).json({
        error: 'Title and workspaceId are required',
      });
    }

    // Verify workspace exists
    const workspaceCheck = await db.query(
      'SELECT id FROM workspaces WHERE id = $1',
      [workspaceId]
    );

    if (workspaceCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    const taskStatus = status || 'todo';

    const result = await db.query(
      `INSERT INTO tasks
        (title, description, status, workspace_id,
         assigned_to, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, title, description, status,
                 workspace_id, assigned_to, created_by,
                 created_at, updated_at`,
      [
        title,
        description || null,
        taskStatus,
        workspaceId,
        assignedTo || null,
        userId,
      ]
    );

    res.status(201).json({
      message: 'Task created successfully',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update task
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, assignedTo } = req.body;

    if (!title && description === undefined && !status && assignedTo === undefined) {
      return res.status(400).json({
        error: 'At least one field is required to update',
      });
    }

    const updateFields = [];
    const values = [];

    if (title) {
      updateFields.push(`title = $${values.length + 1}`);
      values.push(title);
    }

    if (description !== undefined) {
      updateFields.push(`description = $${values.length + 1}`);
      values.push(description ?? null);
    }

    if (status) {
      updateFields.push(`status = $${values.length + 1}`);
      values.push(status);
    }

    if (assignedTo !== undefined) {
      updateFields.push(`assigned_to = $${values.length + 1}`);
      values.push(assignedTo ?? null);
    }

    updateFields.push('updated_at = NOW()');

    values.push(id);

    const query = `
      UPDATE tasks
      SET ${updateFields.join(', ')}
      WHERE id = $${values.length}
      RETURNING id, title, description, status,
                workspace_id, assigned_to, created_by,
                created_at, updated_at
    `;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({
      message: 'Task updated successfully',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Delete task
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get tasks by status in a workspace
 */
export const getTasksByStatus = async (req, res) => {
  try {
    const { workspaceId, status } = req.params;

    const validStatuses = ['todo', 'in_progress', 'done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be todo, in_progress or done',
      });
    }

    const workspaceCheck = await db.query(
      'SELECT id FROM workspaces WHERE id = $1',
      [workspaceId]
    );

    if (workspaceCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    const result = await db.query(
      `SELECT id, title, description, status, workspace_id,
              assigned_to, created_by, created_at, updated_at
       FROM tasks
       WHERE workspace_id = $1 AND status = $2
       ORDER BY created_at DESC`,
      [workspaceId, status]
    );

    res.status(200).json({ tasks: result.rows });
  } catch (error) {
    console.error('Get tasks by status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
