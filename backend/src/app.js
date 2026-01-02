import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import workspaceRoutes from './routes/workspace.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes publiques (pas besoin d'authentification)
app.use('/auth', authRoutes);

// Routes protégées (nécessitent l'authentification via le middleware)
app.use('/workspaces', workspaceRoutes);
app.use('/tasks', taskRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

export default app;
