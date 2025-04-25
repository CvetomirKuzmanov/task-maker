import { TaskService } from "@/app/services/taskService";
import { apiResponse } from "@/app/utils/api";
import { AppError, handleError } from "@/app/utils/error";

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const task  = await TaskService.getTaskById(Number(id))

        if (!task) {
            throw new AppError ('Task not found', 404)
        }
        
        return apiResponse.success(task)
    } catch (err) {
        return handleError(err)
    }
}

export async function PUT (request, {params}) {
    try {
        const {id} = params
        const body = await request.json ()
        const task = await TaskService.updateTask(Number(id), body)
        
        if (!task) {
            throw new AppError('Task not found', 404)
        }

        return apiResponse.success(task)
    } catch (err) {
        return handleError(err)
    }
}

export async function DELETE (request, {params}) {
    try {
        const {id} = params
        const success = await TaskService.deleteTask (Number(id))
        if (!success) {
            throw new AppError('Task not found', 404);
        }

        return apiResponse.success ({message: 'Task deleted successfully'})
    } catch (err) {
        return handleError(err);
    }
}