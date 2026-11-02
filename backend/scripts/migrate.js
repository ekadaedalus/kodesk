// KODESK Database Migration Script
// Runs initDatabase.sql to create/update the schema

const fs = require('fs');
const path = require('path');

// Load .env from backend folder
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Shared pool: uses DATABASE_URL (+ DB_SSL) when set, otherwise the individual DB_* vars
const pool = require('../models/database');

console.log(`Target database: ${process.env.DATABASE_URL ? 'DATABASE_URL' : `${process.env.DB_HOST || 'localhost'}/${process.env.DB_NAME || 'kodesk_db'}`}${process.env.DB_SSL === 'true' ? ' (SSL)' : ''}`);

async function migrate() {
  try {
    console.log('\nRunning database migrations...');

    const sqlFile = path.join(__dirname, 'initDatabase.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    await pool.query(sql);

    // Create arcade scores table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_arcade_scores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        game_id VARCHAR(50) NOT NULL,
        score INTEGER NOT NULL DEFAULT 0,
        played_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Database migrations completed successfully.\n');

    // Verify tables
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('Current tables:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    await pool.end(); // cleanly close connection
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await pool.end(); // close connection on error too
    process.exit(1);
  }
}

migrate();
