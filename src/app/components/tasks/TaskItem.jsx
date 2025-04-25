'use client'

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
                Created: {task.create_at}
            </div>
        </li>
    );

}