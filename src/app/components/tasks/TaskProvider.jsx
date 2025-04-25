'use client';
import { useEffect } from 'react';
import { useTasks } from '../../hooks/useTasks';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

export default function TasksProvider({ initialTasks = [] }) {
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    deleteTask
  } = useTasks(initialTasks || []);
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
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