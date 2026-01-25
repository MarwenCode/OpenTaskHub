import { db } from './config/db.js';
import { fileURLToPath } from 'url';

export const createTables = async () => {
  try {
    console.log('Checking database tables...');

    // Enable UUID extension if not enabled
    await db.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    // Create Tasks Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
        workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
        assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
        created_by UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Comments Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Tables checked/created successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

// Run directly if executed as a script (node src/setupDatabase.js)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createTables()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}