import { db } from '../config/db.js';
import { TaskModel } from '../models/task.model.js';

/**
 * Get all tasks in a workspace
 */
export const getTasksByWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const result = await db.query(
      'SELECT * FROM tasks WHERE workspace_id = $1 ORDER BY created_at DESC',
      [workspaceId]
    );

    res.status(200).json({ tasks: result.rows });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOwnTasks = async (req, res) => {
  try {
    const userId = req.userId; // from JWT middleware   
    const result = await db.query(
      'SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY created_at DESC',
      [userId]
    );  


    res.status(200).json({ tasks: result.rows });
  } catch (error) {
    console.error('Get own tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }     
};

/**
 * Get task by ID
 */
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);

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
    const userId = req.userId; // from JWT middleware

    if (!title || !workspaceId) {
      return res.status(400).json({
        error: 'Title and workspaceId are required',
      });
    }

    const result = await db.query(
      `INSERT INTO tasks 
        (title, description, status, workspace_id, assigned_to, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [
        title,
        description || null,
        status || 'todo',
        workspaceId,
        assignedTo || null,
        userId
      ]
    );

    // Auto-create notification when a task is assigned on creation
    if (assignedTo) {
      await db.query(
        `INSERT INTO notifications (user_id, type, message, task_id, workspace_id, is_read, created_at)
         VALUES ($1, 'task_assigned', $2, $3, $4, false, NOW())`,
        [
          assignedTo,
          `You have been assigned to task "${result.rows[0].title}".`,
          result.rows[0].id,
          result.rows[0].workspace_id,
        ]
      );
    }

    res.status(201).json({
      message: 'Task created successfully',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Create task error:', error);
    // Handle specific Postgres errors
    if (error.code === '23503') {
      return res.status(400).json({ error: 'Invalid workspace ID or user ID (Foreign Key Violation).' });
    }
    if (error.code === '22P02') {
      return res.status(400).json({ error: 'Invalid UUID format.' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update task
 */
export const updateTask = async (req, res) => {
  const client = await db.connect();
  try {
    const { id } = req.params;
    const { title, description, status, assignedTo } = req.body;

    await client.query('BEGIN');

    const currentTaskResult = await client.query(
      'SELECT id, title, workspace_id, assigned_to FROM tasks WHERE id = $1 FOR UPDATE',
      [id]
    );

    if (currentTaskResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Task not found' });
    }

    const currentTask = currentTaskResult.rows[0];

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (title) { fields.push(`title = $${paramIndex++}`); values.push(title); }
    if (description !== undefined) { fields.push(`description = $${paramIndex++}`); values.push(description); }
    if (status) { fields.push(`status = $${paramIndex++}`); values.push(status); }
    if (assignedTo !== undefined) { fields.push(`assigned_to = $${paramIndex++}`); values.push(assignedTo); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE tasks 
      SET ${fields.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING *
    `;

    const result = await client.query(query, values);
    const updatedTask = result.rows[0];

    const assigneeChanged =
      assignedTo !== undefined &&
      assignedTo !== null &&
      assignedTo !== '' &&
      String(assignedTo) !== String(currentTask.assigned_to);

    if (assigneeChanged) {
      await client.query(
        `INSERT INTO notifications (user_id, type, message, task_id, workspace_id, is_read, created_at)
         VALUES ($1, 'task_assigned', $2, $3, $4, false, NOW())`,
        [
          assignedTo,
          `You have been assigned to task "${updatedTask.title}".`,
          updatedTask.id,
          updatedTask.workspace_id,
        ]
      );
    }

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

/**
 * Delete task
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);

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

    if (!TaskModel.STATUSES.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be todo, in_progress or done',
      });
    }

    const result = await db.query(
      'SELECT * FROM tasks WHERE workspace_id = $1 AND status = $2 ORDER BY created_at DESC',
      [workspaceId, status]
    );

    res.status(200).json({ tasks: result.rows });
  } catch (error) {
    console.error('Get tasks by status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Add a comment to a task
 */
export const addComment = async (req, res) => {
  try {
    const { id } = req.params; // Task ID
    const { text } = req.body;
    const userId = req.userId; // Fixed: req.user is undefined, use req.userId from middleware

    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const result = await db.query(
      `WITH inserted AS (
         INSERT INTO comments (task_id, user_id, text, created_at)
         VALUES ($1, $2, $3, NOW())
         RETURNING id, task_id, user_id, text, created_at
       )
       SELECT i.*, u.username, u.email 
       FROM inserted i
       JOIN users u ON i.user_id = u.id`,
      [id, userId, text]
    );

    res.status(201).json({
      message: 'Comment added successfully',
      comment: result.rows[0],
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get comments for a task
 */
export const getTaskComments = async (req, res) => {
  try {
    const { id } = req.params; // Task ID

    const result = await db.query(
      `SELECT c.id, c.text, c.created_at, u.username, u.email 
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.task_id = $1
       ORDER BY c.created_at ASC`,
      [id]
    );

    res.status(200).json({ comments: result.rows });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
