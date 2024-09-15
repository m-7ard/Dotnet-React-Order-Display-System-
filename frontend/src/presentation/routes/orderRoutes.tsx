import { createRoute } from "@tanstack/react-router";
import rootRoute from "./_rootRoute";
import commandDispatcher from "../deps/commandDispatcher";
import ListOrdersCommand from "../../application/commands/orders/listOrders/ListOrdersCommand";
import OrdersPage from "../Application/Orders/OrdersPage";
import CreateOrderPage from "../Application/Orders/Create/CreateOrderPage";
import ManageOrderPage from "../Application/Orders/Manage/ManageOrderPage";
import { orderStateManager } from "../deps/stateManagers";
import ReadOrderCommand from "../../application/commands/orders/readOrder/ReadOrderCommand";
import { Value } from "@sinclair/typebox/value";
import { Type } from "@sinclair/typebox";
import Order from "../../domain/models/Order";
import UnknownError from "../../application/errors/UnkownError";
import ILoaderResult from "../../application/interfaces/ILoaderResult";

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
    component: ManageOrderPage,
});

export default [baseOrdersRoute, createOrderRoute, manageOrderRoute];
