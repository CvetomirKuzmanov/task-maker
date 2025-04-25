'use client'
import TaskItem from './TaskItem'

export default function TaskList({tasks, isLoading, error, onDeleteTask}) {
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
    
    // This part was missing - code to render tasks when they exist
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