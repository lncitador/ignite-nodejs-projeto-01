import createServer from "../libs/http/server.js";
import bodyParser from "../libs/http/middlewares/bodyParser.js";
import { routes } from "./routes/index.js";

export const server = createServer();

server.use(bodyParser.json)

server.use(routes)

server.get("/", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });

    const html = `
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://cdn.tailwindcss.com"></script>
                <title>Projeto 01</title>
            </head>
            <body class="bg-slate-900">
                <main class="container mx-auto">
                    <div class="flex flex-col justify-center items-center min-h-full">
                        <h1 class="text-3xl font-bold underline text-rose-600">
                            Olá, Rocketseat!
                        </h1>
                        <p class="text-2xl font-bold text-white text-slate-300 my-2">
                            Seja bem-vindo ao minha resolução do desafio 01 do Ignite - NodeJS
                        </p>
                        <p class="text-xl font-bold text-white text-slate-100 my-2">
                            Acesse o <a href="" class="underline text-rose-600">README.md</a> para mais informações sobre o projeto.
                        </p>
                    </div>
                </main>
            </body>
        </html>
    `
    res.write(html);
    res.end();
});
