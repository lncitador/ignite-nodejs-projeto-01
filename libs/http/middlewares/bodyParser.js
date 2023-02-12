const json = async (req, res) => {
    if (req.headers['content-type'] === 'application/json') {
        const chunks = [];

        for await (const chunk of req) {
            chunks.push(chunk);
        }

        try {
            req.body = JSON.parse(Buffer.concat(chunks).toString())
        } catch {
            req.body = null
        }

        res.setHeader('Content-Type', 'application/json');
    }
}

export default {
    json
};