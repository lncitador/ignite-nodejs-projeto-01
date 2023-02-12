import { randomUUID } from "node:crypto";
import router from "../../../libs/http/router.js";
import database from "../../../libs/database/index.js";

export const createTaskRoute = router.post("/tasks", async (req, res) => {
    const { title, description } = req.body

    if (!title) {
        return res.writeHead(400).end(
            JSON.stringify({ message: 'title is required' }),
        )
    }

    if (!description) {
        return res.writeHead(400).end(
            JSON.stringify({ message: 'description is required' })
        )
    }

    const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
    }

    await database.insert('tasks', task)

    return res.writeHead(201).end()
});