import database from "../../../libs/database/index.js";
import router from "../../../libs/http/router.js";

export const completeTaskRoute = router.patch("/tasks/:id/complete", async (req, res) => {
    const { id } = req.params

    const [task] = await database.select('tasks', { id })

    if (!task) {
        return res.writeHead(404).end()
    }

    const isTaskCompleted = !!task.completed_at
    const completed_at = isTaskCompleted ? null : new Date()

    const taskUpdated = await database.update('tasks', id, { completed_at })

    return res.writeHead(201).end(
        JSON.stringify(taskUpdated)
    )
});