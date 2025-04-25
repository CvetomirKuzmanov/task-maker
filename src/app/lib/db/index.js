import { pool } from "./pool";

export async function query (text, params) {    
    const start = Date.now()
    try {
        const res = await pool.query (text,params)
        const duration = Date.now() - start;

        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res
    
    } catch (err){
        console.error('Query error', { text, err });
    throw err;
    }
}