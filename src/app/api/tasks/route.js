import { TaskService } from "@/app/services/taskService";
import { apiResponse } from "@/app/utils/api";
import { AppError, handleError } from "@/app/utils/error";

export async function GET() {
  
  try {
    const tasks = await TaskService.getAllTasks();
    if (!tasks) {
      throw new AppError("Tasks not found", 404);
    }
    return apiResponse.success(tasks);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request) {
    try {
      const body = await request.json();
      const task = await TaskService.createTask(body);
      return apiResponse.success(task);
    } catch (err) {
      return handleError(err);
    }
  }