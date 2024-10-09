import { createRoute } from "@tanstack/react-router";
import rootRoute from "./_rootRoute";
import commandDispatcher from "../deps/commandDispatcher";
import ListOrdersCommand from "../../application/commands/orders/listOrders/ListOrdersCommand";
import OrdersPage from "../Application/Orders/OrdersPage";
import CreateOrderPage from "../Application/Orders/Create/CreateOrderPage";
import { orderStateManager } from "../deps/stateManagers";
import ReadOrderCommand from "../../application/commands/orders/readOrder/ReadOrderCommand";
import { Value } from "@sinclair/typebox/value";
import { Type } from "@sinclair/typebox";
import Order from "../../domain/models/Order";
import UnknownError from "../../application/errors/UnkownError";
import ILoaderResult from "../../application/interfaces/ILoaderResult";
import ManageOrderRoute from "../Application/Orders/Manage/ManageOrderRoute";
import parseListOrdersCommandParameters from "../../application/commands/orders/listOrders/parseListOrdersCommandParameters";
import routeData from "./_routeData";

const baseOrdersRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.listOrders.pattern,
    loaderDeps: ({ search }: { search: Record<string, string> }) => search,
    loader: async ({ deps }) => {
        const parsedParams = parseListOrdersCommandParameters(deps);
        const command = new ListOrdersCommand(parsedParams);
        const result = await commandDispatcher.dispatch(command);

        return {
            ordersResult: result,
        };
    },
    component: OrdersPage,
});

const createOrderRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.createOrder.pattern,
    component: CreateOrderPage,
});

const manageOrderRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.manageOrder.pattern,
    loader: async ({ params }): Promise<ILoaderResult<Order, unknown>> => {
        const id = parseInt(params.id);
        if (!Value.Check(Type.Integer(), id)) {
            return {
                ok: false,
                data: new Error(`Order id "${params.id}" is not a valid id.`),
            };
        }

        const cachedOrder = orderStateManager.getOrder(id);
        if (cachedOrder != null) {
            return { ok: true, data: cachedOrder };
        }

        const command = new ReadOrderCommand({ orderId: id });
        const result = await commandDispatcher.dispatch(command);

        if (result.isOk()) {
            return {
                ok: true,
                data: result.value.order,
            };
        }

        const { type, data } = result.error;

        return {
            ok: false,
            data: type === "Exception" ? data : new UnknownError({}),
        };
    },
    component: ManageOrderRoute,
});

export default [baseOrdersRoute, createOrderRoute, manageOrderRoute];
