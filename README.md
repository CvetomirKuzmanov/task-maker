// File structure:
// /app
//   /api
//     /tasks
//       /route.js
//   /components
//     /tasks
//       /TaskForm.jsx
//       /TaskItem.jsx
//       /TaskList.jsx
//   /lib
//     /db
//       /index.js
//       /pool.js
//     /validators
//       /taskValidator.js
//   /models
//     /taskModel.js
//   /services
//     /taskService.js
//   /hooks
//     /useTasks.js
//   /utils
//     /api.js
//     /error.js
//   /page.jsx
//   /layout.jsx
// /config
//   /database.js

// 1. Database Configuration
// /config/database.js
export const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'taskmanager',
  password: process.env.DB_PASSWORD || 'your_password',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

// 2. Database Connection
// /lib/db/pool.js
import { Pool } from 'pg';
import { dbConfig } from '@/config/database';

let pool;

if (!pool) {
  pool = new Pool(dbConfig);
}

export { pool };

// /lib/db/index.js
import { pool } from './pool';

/**
 * Execute a database query
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise} - Query result
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error', { text, error });
    throw error;
  }
}

// 3. Data Models
// /models/taskModel.js
import { query } from '@/lib/db';

export const TaskModel = {
  /**
   * Get all tasks
   * @returns {Promise<Array>} Array of task objects
   */
  findAll: async () => {
    const result = await query('SELECT * FROM tasks ORDER BY id DESC');
    return result.rows;
  },

  /**
   * Get a task by ID
   * @param {number} id - Task ID
   * @returns {Promise<Object|null>} Task object or null
   */
  findById: async (id) => {
    const result = await query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  /**
   * Create a new task
   * @param {Object} task - Task data
   * @returns {Promise<Object>} Created task
   */
  create: async ({ title, description }) => {
    const result = await query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    return result.rows[0];
  },

  /**
   * Update a task
   * @param {number} id - Task ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated task or null
   */
  update: async (id, updates) => {
    const { title, description } = updates;
    const result = await query(
      'UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description, id]
    );
    return result.rows[0] || null;
  },

  /**
   * Delete a task
   * @param {number} id - Task ID
   * @returns {Promise<boolean>} Success status
   */
  delete: async (id) => {
    const result = await query('DELETE FROM tasks WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
};

// 4. Validation
// /lib/validators/taskValidator.js
export const validateTask = (data) => {
  const errors = {};

  if (!data.title || data.title.trim() === '') {
    errors.title = 'Title is required';
  } else if (data.title.length > 255) {
    errors.title = 'Title must be less than 255 characters';
  }

  if (data.description && data.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// 5. Business Logic / Services
// /services/taskService.js
import { TaskModel } from '@/models/taskModel';
import { validateTask } from '@/lib/validators/taskValidator';

export const TaskService = {
  /**
   * Get all tasks
   */
  getAllTasks: async () => {
    return await TaskModel.findAll();
  },

  /**
   * Get task by ID
   */
  getTaskById: async (id) => {
    return await TaskModel.findById(id);
  },

  /**
   * Create a new task
   */
  createTask: async (taskData) => {
    const validation = validateTask(taskData);
    
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }
    
    return await TaskModel.create(taskData);
  },

  /**
   * Delete a task
   */
  deleteTask: async (id) => {
    return await TaskModel.delete(id);
  },

  /**
   * Update a task
   */
  updateTask: async (id, updates) => {
    const validation = validateTask(updates);
    
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }
    
    return await TaskModel.update(id, updates);
  }
};

// 6. API Utils
// /utils/api.js
/**
 * Standard API response formatter
 */
export const apiResponse = {
  success: (data, status = 200) => {
    return Response.json(data, { status });
  },
  
  error: (message, status = 400) => {
    return Response.json({ error: message }, { status });
  },
  
  serverError: (error) => {
    console.error('Server error:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
};

// /utils/error.js
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error) => {
  if (error instanceof AppError) {
    return apiResponse.error(error.message, error.statusCode);
  }
  return apiResponse.serverError(error);
};

// 7. API Routes
// /app/api/tasks/route.js
import { TaskService } from '@/services/taskService';
import { apiResponse } from '@/utils/api';
import { AppError, handleError } from '@/utils/error';

export async function GET() {
  try {
    const tasks = await TaskService.getAllTasks();
    return apiResponse.success(tasks);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const task = await TaskService.createTask(body);
    return apiResponse.success(task, 201);
  } catch (error) {
    return handleError(error);
  }
}

// /app/api/tasks/[id]/route.js
import { TaskService } from '@/services/taskService';
import { apiResponse } from '@/utils/api';
import { AppError, handleError } from '@/utils/error';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const task = await TaskService.getTaskById(Number(id));
    
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    
    return apiResponse.success(task);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const task = await TaskService.updateTask(Number(id), body);
    
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    
    return apiResponse.success(task);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const success = await TaskService.deleteTask(Number(id));
    
    if (!success) {
      throw new AppError('Task not found', 404);
    }
    
    return apiResponse.success({ message: 'Task deleted successfully' });
  } catch (error) {
    return handleError(error);
  }
}

// 8. Frontend Hooks
// /hooks/useTasks.js
'use client';

import { useState, useCallback } from 'react';

export function useTasks(initialTasks = []) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/tasks');
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }
      
      const newTask = await response.json();
      setTasks(prevTasks => [newTask, ...prevTasks]);
      return newTask;
    } catch (err) {
      setError(err.message);
      console.error('Error creating task:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting task:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    deleteTask
  };
}

// 9. UI Components
// /components/tasks/TaskItem.jsx
'use client';

export default function TaskItem({ task, onDelete }) {
  return (
    <li className="border p-4 rounded-md bg-gray-50 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">{task.title}</h3>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50"
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
      {task.description && (
        <p className="mt-2 text-gray-600">{task.description}</p>
      )}
      <div className="mt-2 text-xs text-gray-400">
        Created: {new Date(task.created_at).toLocaleString()}
      </div>
    </li>
  );
}

// /components/tasks/TaskList.jsx
'use client';

import TaskItem from './TaskItem';

export default function TaskList({ tasks, isLoading, error, onDeleteTask }) {
  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tasks found. Add your first task above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Tasks</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onDelete={onDeleteTask}
          />
        ))}
      </ul>
    </div>
  );
}

// /components/tasks/TaskForm.jsx
'use client';

import { useState } from 'react';

export default function TaskForm({ onCreateTask }) {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onCreateTask(formData);
      setFormData({ title: '', description: '' });
    } catch (error) {
      // Handle errors from createTask
      try {
        const parsedErrors = JSON.parse(error.message);
        if (typeof parsedErrors === 'object') {
          setErrors(parsedErrors);
        }
      } catch (e) {
        // If we can't parse the error, just set a generic error
        setErrors({ form: error.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-8">
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>
      
      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded">
          {errors.form}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Task Title<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>
      
      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`w-full p-2 border rounded-md ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          isSubmitting 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSubmitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}

// 10. Page Component
// /app/page.jsx
import { TaskService } from '@/services/taskService';
import TaskList from './components/tasks/TaskList';
import TaskForm from './components/tasks/TaskForm';
import TasksProvider from './components/tasks/TasksProvider';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Server-side initial data fetching
  let initialTasks = [];
  
  try {
    initialTasks = await TaskService.getAllTasks();
  } catch (error) {
    console.error('Failed to fetch initial tasks:', error);
    // Continue rendering with empty tasks array
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Task Manager</h1>
        <p className="text-gray-600">
          A structured Next.js + PostgreSQL application
        </p>
      </header>
      
      <TasksProvider initialTasks={initialTasks} />
    </main>
  );
}

// /components/tasks/TasksProvider.jsx
'use client';

import { useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

export default function TasksProvider({ initialTasks }) {
  const { 
    tasks, 
    isLoading, 
    error, 
    fetchTasks, 
    createTask, 
    deleteTask 
  } = useTasks(initialTasks);

  useEffect(() => {
    // Only refetch if we didn't get initial data
    if (initialTasks.length === 0) {
      fetchTasks();
    }
  }, [fetchTasks, initialTasks.length]);

  return (
    <div>
      <TaskForm onCreateTask={createTask} />
      <TaskList 
        tasks={tasks}
        isLoading={isLoading}
        error={error}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}

// 11. Layout Component
// /app/layout.jsx
export const metadata = {
  title: 'Task Manager - Next.js + PostgreSQL App',
  description: 'A well-structured task management application using Next.js and PostgreSQL',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <div className="py-8">
          {children}
        </div>
      </body>
    </html>
  );
}

// 12. Database Schema
/*
CREATE DATABASE taskmanager;

\c taskmanager

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- For production, you might want to add indexes:
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_modtime
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
*/

// 13. Sample .env file
/*
# .env.local
DB_USER=postgres
DB_HOST=localhost
DB_NAME=taskmanager
DB_PASSWORD=your_password
DB_PORT=5432
DB_SSL=false
*/

// 14. Package.json (key dependencies)
/*
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "pg": "^8.11.3"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:migrate": "node scripts/migrate.js"
  }
}
*/