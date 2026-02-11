import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import workspaceRoutes from './routes/workspace.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// Configuration dynamique des CORS
const allowedOrigins = [
  'http://localhost:5173',                         
  'https://opentaskhub-frontend.onrender.com'   
      
];

app.use(cors({
  origin: function (origin, callback) {
    // Autorise les requêtes sans origine (comme Postman) ou les origines listées
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqué par la politique CORS de OpenTaskHub'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Health check pour Render (permet de savoir si le serveur est réveillé)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Gestion des erreurs globale (pour éviter que le serveur crash)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur interne est survenue sur le serveur' });
});

export default app;