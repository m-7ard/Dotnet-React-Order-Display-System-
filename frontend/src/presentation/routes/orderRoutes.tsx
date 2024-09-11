import { createRoute } from "@tanstack/react-router";
import rootRoute from "./_rootRoute";
import commandDispatcher from "../deps/commandDispatcher";
import ListOrdersCommand from "../../application/commands/orders/listOrders/ListOrdersCommand";
import OrdersPage from "../Application/Orders/OrdersPage";
import CreateOrderPage from "../Application/Orders/Create/CreateOrderPage";

const baseOrdersRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/orders",
    loaderDeps: ({
        search,
    }: {
        search: {
            minTotal?: number;
            maxTotal?: number;
            status?: string;
            createdBefore?: Date;
            createdAfter?: Date;
        };
    }) => search,
    loader: async ({ deps }) => {
        const command = new ListOrdersCommand({
            minTotal: deps.minTotal ?? null,
            maxTotal: deps.maxTotal ?? null,
            status: deps.status ?? null,
            createdBefore: deps.createdBefore ?? null,
            createdAfter: deps.createdAfter ?? null,
        });
        const result = await commandDispatcher.dispatch(command);
        
        return {
            ordersResult: result
        }
    },
    component: OrdersPage,
});

const createOrderRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/orders/create",
    component: CreateOrderPage,
});


export default [
    baseOrdersRoute,
    createOrderRoute
];