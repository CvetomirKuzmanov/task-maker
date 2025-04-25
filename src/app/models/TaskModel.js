import { query } from "../lib/db";

export const TaskModel = {
  findAll: async () => {
    const result = await query('SELECT * FROM tasks ORDER BY id DESC');
    return result.rows; // Fixed: Was 'row' instead of 'rows'
  },
  
  findById: async (id) => {
    const result = await query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0] || null;
  },
  
  create: async ({title, description}) => {
    const result = await query('INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *', [title, description]);
    return result.rows[0];
  },
  
  update: async (id, updates) => { // Fixed: Parameter structure matches how it's called
    const {title, description} = updates;
    const result = await query('UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *', [title, description, id]);
    return result.rows[0];
  },
  
  delete: async (id) => { // Fixed: Parameter structure matches how it's called
    const result = await query('DELETE FROM tasks WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}