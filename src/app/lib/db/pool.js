import { Pool } from "pg";

console.log("Attempting to connect to:", process.env.DB_HOST);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => {
  console.log('Connected to database successfully');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

export { pool };