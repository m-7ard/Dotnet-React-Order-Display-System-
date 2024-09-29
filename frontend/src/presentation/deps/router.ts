import { createRouter } from "@tanstack/react-router";
import rootRoute from "../routes/_rootRoute";
import productRoutes from "../routes/productRoutes";
import applicationRoutes from "../routes/applicationRoutes";
import orderRoutes from "../routes/orderRoutes";
import productHistoryRoutes from "../routes/productHistoryRoutes";


const routeTree = rootRoute.addChildren([
    ...applicationRoutes,
    ...productRoutes,
    ...orderRoutes,
    ...productHistoryRoutes
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