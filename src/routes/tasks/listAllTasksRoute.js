import database from "../../../libs/database/index.js";
import router from "../../../libs/http/router.js";

export const listAllTasksRoute = router.get("/tasks", async (req, res) => {
    const tasks = await database.select('tasks')

    return res.writeHead(200).end(JSON.stringify(tasks))
});