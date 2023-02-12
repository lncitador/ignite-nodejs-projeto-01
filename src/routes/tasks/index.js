import { createTaskRoute } from './createTaskRoute.js'
import { listAllTasksRoute } from './listAllTasksRoute.js'
import { updateTaskByIdRoute } from './updateTaskByIdRoute.js'
import { deleteTaskByIdRoute } from './deleteTaskByIdRoute.js'
import { completeTaskRoute } from './completeTaskRoute.js'

export const taskRoutes = {
    createTaskRoute,
    listAllTasksRoute,
    updateTaskByIdRoute,
    deleteTaskByIdRoute,
    completeTaskRoute,
}