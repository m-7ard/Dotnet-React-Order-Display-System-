import { createRouter, ParseRoute } from "@tanstack/react-router";
import rootRoute from "../routes/tanstack/rootRoute";
import productRoutes from "../routes/tanstack/children/products/productRoutes";
import applicationRoutes from "../routes/tanstack/children/applicationRoutes";
import orderRoutes from "../routes/tanstack/children/orders/orderRoutes";
import productHistoryRoutes from "../routes/tanstack/children/product_histories/productHistoryRoutes";
import errorRoutes from "../routes/tanstack/children/errorRoutes";


const routeTree = rootRoute.addChildren([
    ...applicationRoutes,
    ...productRoutes,
    ...orderRoutes,
    ...productHistoryRoutes,
    ...errorRoutes
]);

const router = createRouter({
    routeTree,
    defaultGcTime: 0,
});

export type ValidTanstackRoutes = ParseRoute<typeof routeTree>['fullPath'];

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

export default router;