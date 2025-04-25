// pages/api/test-connection.js or app/api/test-connection/route.js
import { pool } from '../../path-to-your-pool-file';

export async function GET() {
  try {
    // Just try to connect and run a simple query
    const result = await pool.query('SELECT NOW()');
    return new Response(JSON.stringify({ 
      connected: true, 
      timestamp: result.rows[0].now,
      host: process.env.DB_HOST
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      connected: false, 
      error: error.message,
      host: process.env.DB_HOST,
      code: error.code
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}