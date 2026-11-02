// KODESK Database Seeding Script
// This script populates the database with sample tasks, games, and learning content

const fs = require('fs');
const path = require('path');

// Load .env from backend folder
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Shared pool: uses DATABASE_URL (+ DB_SSL) when set, otherwise the individual DB_* vars
const pool = require('../models/database');

console.log(`Target database: ${process.env.DATABASE_URL ? 'DATABASE_URL' : `${process.env.DB_HOST || 'localhost'}/${process.env.DB_NAME || 'kodesk_db'}`}${process.env.DB_SSL === 'true' ? ' (SSL)' : ''}`);

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Read and execute SQL seed file
    const sqlFile = path.join(__dirname, 'seedTasks.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    await pool.query(sql);

    console.log('✅ Database seeded successfully!');
    console.log('📊 Sample data added:');
    console.log('   - Python tasks: 10 tasks');
    console.log('   - Java tasks: 10 tasks');
    console.log('   - C++ tasks: 10 tasks');
    console.log('   - Games: 33 games (30 mini + 3 curated)');

    // Verify data
    const taskCount = await pool.query('SELECT COUNT(*) FROM tasks');
    const gameCount = await pool.query('SELECT COUNT(*) FROM games');

    console.log(`\n📈 Current database stats:`);
    console.log(`   - Total tasks: ${taskCount.rows[0].count}`);
    console.log(`   - Total games: ${gameCount.rows[0].count}`);

    await pool.end(); // close the connection
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await pool.end(); // close connection on error
    process.exit(1);
  }
}

seedDatabase();
