import database from "../../../libs/database/index.js";
import router from "../../../libs/http/router.js";

export const updateTaskByIdRoute = router.put("/tasks/:id", async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.writeHead(400).end(
            JSON.stringify({ message: 'id is required' }),
        )
    }

    const { title, description } = req.body

    if (!title && !description) {
        return res.writeHead(400).end(
            JSON.stringify({ message: 'title or description is required' }),
        )
    }

    try {
        const task = await database.update('tasks', id, {
            title,
            description,
            updated_at: new Date(),
        })
    
        return res.writeHead(201).end(JSON.stringify(task))
    } catch (error) {
        console.log(error.code)
        return res.writeHead(404).end(
            JSON.stringify({ message: error.message }),
        )
    }
});