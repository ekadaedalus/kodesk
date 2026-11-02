const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Prefer a single connection string (e.g. Render's DATABASE_URL); fall back to individual vars for local dev
const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'kodesk_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      ssl,
    });

module.exports = pool;
