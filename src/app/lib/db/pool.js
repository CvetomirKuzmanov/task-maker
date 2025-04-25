import { Pool } from "pg";

let pool;

if (!pool) {
  try {
    pool = new Pool({
      connectionString: process.env.DB_URL,
      ssl: {
        rejectUnauthorized: false, 
      },
    });
  } catch (err) {
    console.log("ERROR CONNECTING TO DATABASE", err);
  }
}

export { pool };