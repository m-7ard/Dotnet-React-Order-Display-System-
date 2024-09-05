import { createRouter } from "@tanstack/react-router";
import rootRoute from "../routes/_rootRoute";
import productRoutes from "../routes/productRoutes";
import applicationRoutes from "../routes/applicationRoutes";


const routeTree = rootRoute.addChildren([
    ...applicationRoutes,
    ...productRoutes,
]);

const router = createRouter({
    routeTree,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

export default router;