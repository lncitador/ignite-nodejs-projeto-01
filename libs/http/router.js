const router = {
    get: (path, handler) => {
        return {
            path,
            handler,
            method: "GET"
        }
    },
    post: (path, handler) => {
        return {
            path,
            handler,
            method: "POST"
        }
    },
    put: (path, handler) => {
        return {
            path,
            handler,
            method: "PUT"
        }
    },
    patch: (path, handler) => {
        return {
            path,
            handler,
            method: "PATCH"
        }
    },
    delete: (path, handler) => {
        return {
            path,
            handler,
            method: "DELETE"
        }
    }
}

export function extractRoutes(router) {
    const routes = [];

    const { path, handler, method } = router;

    if (path && handler && method) {
        routes.push({ path, handler, method });
    } else {
        const entries = Object.entries(router);

        for (const [, value] of entries) {
            const { path, handler, method } = value;

            if (path && handler && method) {
                routes.push({ path, handler, method });
            } else {
                const innerRoutes = extractRoutes(value);

                innerRoutes.forEach(route => {
                    routes.push(route);
                });
            }
        }
    }

    const uniqueRoutes = routes.filter(({ method, path }, index, self) => {
        return self.findIndex(route => route.method === method && route.path === path) === index;
    });

    const duplicatedRoutes = routes.filter(({ method, path }, index, self) => {
        return self.findIndex(route => route.method === method && route.path === path) !== index;
    });

    if (uniqueRoutes.length !== routes.length) {
        throw new Error(`Duplicated route: ${duplicatedRoutes.map(route => `${route.method} ${route.path}`).join(', ')}`);
    }

    return uniqueRoutes;
}



export default router;