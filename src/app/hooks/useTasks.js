"use client";

import { useState, useCallback } from "react";

export function useTasks(initialTasks = []) {
    const [tasks, setTasks] = useState(initialTasks);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/tasks");

            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }

            const data = await response.json();
            setTasks(data);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching tasks", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createTask = useCallback(async (taskData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch ('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error (errorData.error || 'Failed to create task' )
            }

            const newTask = await response.json()
            setTasks (prevTasks => [newTask, ...prevTasks])
            return newTask
        } catch (err) {
            setError(err.message)
            console.error('Error creating task', err)
            throw err
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteTask = useCallback(async (id)=> {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch (`/api/tasks/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error ('Failed to delete task')
            }

            setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
        } catch (err) {
            setError (err.message)
            console.error('Error deleting task', err)
        }finally{ 
            setIsLoading (false)
        }
    }, [])

    return {
        tasks,
        isLoading,
        error,
        fetchTasks,
        createTask,
        deleteTask
    }
}

