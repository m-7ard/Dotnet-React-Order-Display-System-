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
import { parseListOrdersSchema } from "../schemas/listOrdersSchema";
import ManageOrderRoute from "../Application/Orders/Manage/ManageOrderRoute";

const baseOrdersRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/orders",
    loaderDeps: ({
        search,
    }: {
        search: {
            id?: string;
            minTotal?: string;
            maxTotal?: string;
            status?: string;
            createdBefore?: string;
            createdAfter?: string;
            productId?: string
        };
    }) => search,
    loader: async ({ deps }) => {
        const parsedParams = parseListOrdersSchema(deps);
        const command = new ListOrdersCommand({
            id: parsedParams.id,
            minTotal: parsedParams.minTotal,
            maxTotal: parsedParams.maxTotal,
            status: parsedParams.status,
            createdBefore: parsedParams.createdBefore,
            createdAfter: parsedParams.createdAfter,
            productId: parsedParams.productId,
        });
        const result = await commandDispatcher.dispatch(command);

        return {
            ordersResult: result,
        };
    },
    component: OrdersPage,
});

const createOrderRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/orders/create",
    component: CreateOrderPage,
});

const manageOrderRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/orders/$id/manage",
    loader: async ({
        params,
    }): Promise<ILoaderResult<Order, unknown>> => {
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
