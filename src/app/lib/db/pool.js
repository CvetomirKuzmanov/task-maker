import { Pool } from "pg";

// For debugging
console.log("Attempting to connect to database with details:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  // Don't log password
});

// Make a connection pool that works better in serverless environments
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
  ssl: { rejectUnauthorized: false },
  // Add these for better serverless performance
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return error after 5 seconds if connection not established
});

// Log connection events
pool.on('connect', () => {
  console.log('Connected to database successfully');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

export { pool };