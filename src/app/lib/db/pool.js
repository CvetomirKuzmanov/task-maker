import { Pool } from "pg";
import { dbConfig } from "@/config/db";

let pool;

if (!pool) {
    pool = new Pool(dbConfig);
}

export { pool }

