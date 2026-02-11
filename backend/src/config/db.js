import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';

dotenv.config();

// On vérifie si on est en production (sur Render)
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL;

const dbConfig = process.env.DATABASE_URL 
  ? {
      // CONFIGURATION CLOUD (Render/Supabase)
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    }
  : {
      // CONFIGURATION LOCALE (Ton PC)
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '', // Mets ton mdp local ici ou dans .env
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'opentaskhub',
    };

export const db = new Pool(dbConfig);

db.on('connect', () => {
  console.log(isProduction ? '🚀 Connected to Supabase (Cloud)' : '💻 Connected to Local PostgreSQL');
});

db.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});