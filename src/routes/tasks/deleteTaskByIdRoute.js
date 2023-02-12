import database from "../../../libs/database/index.js";
import router from "../../../libs/http/router.js";

export const deleteTaskByIdRoute = router.delete("/tasks/:id", async (req, res) => {
    const { id } = req.params

    const [task] = await database.select('tasks', { id })

    if (!task) {
        return res.writeHead(404).end()
    }

    await database.delete('tasks', id)

    return res.writeHead(204).end()
});