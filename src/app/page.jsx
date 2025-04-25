import { TaskService } from './services/taskService';
import TasksProvider from './components/tasks/TaskProvider.jsx';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {

  let initialTasks = [];
  
  try {
    initialTasks = await TaskService.getAllTasks();
  } catch (error) {
    console.error('Failed to fetch initial tasks:', error);
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Task Manager</h1>
        <p className="text-gray-600">
          A task creator.
        </p>
      </header>
      
      <TasksProvider initialTasks={initialTasks} />
    </main>
  );
}