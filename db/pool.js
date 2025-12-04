const { Pool } = require('pg');

// Check if database is configured
const DATABASE_URL = process.env.DATABASE_URL;
const isDbConfigured = !!DATABASE_URL;

// Create PostgreSQL connection pool (only if DATABASE_URL is set)
const pool = isDbConfigured ? new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' && DATABASE_URL.includes('amazonaws.com') 
        ? { rejectUnauthorized: false } 
        : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
}) : null;

// Only set up event handlers if pool exists
if (pool) {
    // Log connection status
    pool.on('connect', () => {
        console.log('✅ PostgreSQL connected');
    });

    pool.on('error', (err) => {
        console.error('❌ PostgreSQL connection error:', err);
    });

    // Test connection on startup
    pool.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('❌ Database connection test failed:', err.message);
        } else {
            console.log('✅ Database connection test successful:', res.rows[0].now);
        }
    });
} else {
    console.log('⚠️ DATABASE_URL not configured - database features disabled');
}

module.exports = pool;
