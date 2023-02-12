import http from 'http';
import router, { extractRoutes } from './router.js'

/* It's a class that creates a server that can handle requests and responses, and it
can also handle middlewares and routes */
class Server {
    #server;

    #middlewares = [];
    
    #routes = [];

    constructor() {
        this.#server = http.createServer(
            this.#listener
        )
    }

    /* This is the listener function that will be called every time a request is made
    to the server. */
    #listener = async (req, res) => {
        await Promise.all(
            this.#middlewares.map(middleware => middleware(req, res))
        )

        const route = this.#routes.find(({ method, path }) => {
            return method === req.method && path.test(req.url);
        });

        if (route) {
            console.log(req.body)
            const routeParams = req.url.match(route.path)

            const { query, ...params } = routeParams.groups

            req.params = params
            req.query = query ? this.#extractQueryParams(query) : {}

            return route.handler(req, res);
        } else {
            res.writeHead(404).end();
        }
    };

    start(port = 4321) {
        this.#server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }

    /**
     * If the handler is a function, add it to the middlewares array, otherwise, if
     * it's an object, extract the routes from it, check if there are duplicated
     * routes, and add them to the routes array
     * @param handler - The middleware function or object route to be added to the
     * middleware stack.
     */
    use(handler) {
        if (typeof handler !== 'function' && typeof handler !== 'object') {
            throw new Error('Middleware must be a function or an object route');
        } else if (typeof handler === 'object') {
            const routes = extractRoutes(handler);

            this.#hasDuplicatedRoute(routes);

            routes.forEach(route => {
                this.#routes.push({
                    ...route,
                    path: this.#buildRoutePath(route.path)
                });
            })
        } else {
            this.#middlewares.push(handler);
        }
    }

    get(path, handler) {
        const route = router.get(path, handler);

        this.#hasDuplicatedRoute(route);

        this.#routes.push({
            ...route,
            path: this.#buildRoutePath(route.path)
        })
    }

    post(path, handler) {
        const route = router.post(path, handler);

        this.#hasDuplicatedRoute(route);

        this.#routes.push({
            ...route,
            path: this.#buildRoutePath(route.path)
        })
    }

    put(path, handler) {
        const route = router.put(path, handler);

        this.#hasDuplicatedRoute(route);

        this.#routes.push({
            ...route,
            path: this.#buildRoutePath(route.path)
        })
    }

    patch(path, handler) {
        const route = router.patch(path, handler);

        this.#hasDuplicatedRoute(route);

        this.#routes.push({
            ...route,
            path: this.#buildRoutePath(route.path)
        })
    }

    delete(path, handler) {
        const route = router.delete(path, handler);

        this.#hasDuplicatedRoute(route);

        this.#routes.push({
            ...route,
            path: this.#buildRoutePath(route.path)
        })
    }

    /**
     * It takes a path like `/users/:userId/posts/:postId` and returns a regular
     * expression that matches the path and captures the parameters
     * @param path - The path of the route.
     * @returns A regular expression that matches the path and extracts the
     * parameters.
     */
    #buildRoutePath(path) {
        const routeParametersRegex = /:([a-zA-Z]+)/g
        const paramsWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')

        const pathRegex = new RegExp(`^${paramsWithParams}(?<query>\\?(.*))?$`)

        return pathRegex
    }

    /**
     * It takes a query string, splits it into an array of key-value pairs, and then
     * reduces that array into an object
     * @param query - The query string of the URL, including the question mark (?)
     * @returns An object with the query parameters as keys and the values as values.
     */
    #extractQueryParams(query) {
        return query.substr(1).split('&').reduce((queryParams, param) => {
            const [key, value] = param.split('=')

            queryParams[key] = value

            return queryParams
        }, {})
    }

    /**
     * It checks if the route is already registered
     * @param arg - The argument passed to the function.
     */
    #hasDuplicatedRoute(arg) {
        if (Array.isArray(arg)) {
            const duplicatedRoutes = []

            this.#routes.forEach(({ method, path }) => {
                if (arg.findIndex(route => route.method === method && path.test(path)) !== -1) {
                    duplicatedRoutes.push({ method, path })
                }
            });

            if (duplicatedRoutes.length > 0) {
                throw new Error(`Duplicated routes: ${duplicatedRoutes.map(route => `${route.method} ${route.path}`).join(', ')}`);
            }
        } else {
            const duplicatedRoutes = this.#routes.filter(({ method, path }) => {
                return method === arg.method && path.test(arg.path);
            });

            if (duplicatedRoutes.length > 0) {
                throw new Error(`Duplicated routes: ${duplicatedRoutes.map(route => `${arg.method} ${arg.path}`).join(', ')}`);
            }
        }
    }
}

const createServer = (port) => new Server(port);

export default createServer;