import { TaskModel } from "../models/TaskModel";
import { validateTask } from "../lib/validators/TaskValidator";

export const TaskService = {
  getAllTasks: async () => {
    return await TaskModel.findAll();
  },
  
  getTaskById: async (id) => {
    return await TaskModel.findById(id);
  },
  
  createTask: async (taskData) => {
    const validation = validateTask(taskData);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }
    return await TaskModel.create(taskData);
  },
  
  deleteTask: async (id) => {
    return await TaskModel.delete(id); // Fixed: Was 'TaskData.delete' instead of 'TaskModel.delete'
  },
  
  updateTask: async (id, updates) => {
    const validation = validateTask(updates);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }
    return await TaskModel.update(id, updates);
  }
}