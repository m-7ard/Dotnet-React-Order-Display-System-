import { createRoute } from "@tanstack/react-router";
import rootRoute from "../../rootRoute";
import Order from "../../../../../domain/models/Order";
import ManageOrderRoute from "../../../../Application/Orders/Manage/ManageOrder.Controller";
import CreateOrderController from "../../../../Application/Orders/Create/CreateOrder.Controller";
import { orderDataAccess } from "../../../../deps/dataAccess";
import IListOrdersResponseDTO from "../../../../../infrastructure/contracts/orders/list/IListOrdersResponseDTO";
import orderMapper from "../../../../../infrastructure/mappers/orderMapper";
import OrdersController from "../../../../Application/Orders/Orders.Controller";
import IReadOrderResponseDTO from "../../../../../infrastructure/contracts/orders/read/IReadOrderResponseDTO";
import parseListOrdersCommandParameters from "../../../../../infrastructure/parsers/parseListOrdersCommandParameters";
import TanstackRouterUtils from "../../../../utils/TanstackRouterUtils";
import routeConfig from "../../routeConfig";

export interface IListOrdersLoaderData {
    orders: Order[];
}

const listOrdersRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeConfig.LIST_ORDERS.path,
    loaderDeps: ({ search }: { search: Record<string, string> }) => search,
    loader: async ({ deps }): Promise<IListOrdersLoaderData> => {
        const parsedParams = parseListOrdersCommandParameters(deps);

        const response = await TanstackRouterUtils.handleRequest(orderDataAccess.listOrders(parsedParams));
        if (!response.ok) {
            await TanstackRouterUtils.handleInvalidResponse(response);
        }

        const data: IListOrdersResponseDTO = await response.json();

        return {
            orders: data.orders.map(orderMapper.apiToDomain),
        };
    },
    component: OrdersController,
});

const createOrderRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeConfig.CREATE_ORDER.path,
    component: () => <CreateOrderController orderDataAccess={orderDataAccess} />,
});

export interface IManageOrderLoaderData {
    order: Order;
}

const manageOrderRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeConfig.MANAGE_ORDER.path,
    loader: async ({ params }): Promise<IManageOrderLoaderData> => {
        const id = params.id;

        const response = await TanstackRouterUtils.handleRequest(orderDataAccess.readOrder({ id: id }));
        if (!response.ok) {
            await TanstackRouterUtils.handleInvalidResponse(response);
        }

        const dto: IReadOrderResponseDTO = await response.json();
        return {
            order: orderMapper.apiToDomain(dto.order)
        };
    },
    component: () => <ManageOrderRoute orderDataAccess={orderDataAccess} />,
});

export default [listOrdersRoute, createOrderRoute, manageOrderRoute];
