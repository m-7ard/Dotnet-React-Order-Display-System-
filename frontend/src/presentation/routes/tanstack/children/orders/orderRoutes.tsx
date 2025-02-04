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
import { IManageOrderParams, ListOrdersLoaderData, ManageOrderLoaderData, tanstackConfigs } from "../../../Route";

const listOrdersRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.LIST_ORDERS.pattern,
    loaderDeps: ({ search }: { search: Record<string, string> }) => search,
    loader: async ({ deps }): Promise<ListOrdersLoaderData> => {
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
    path: tanstackConfigs.CREATE_ORDER.pattern,
    component: () => <CreateOrderController orderDataAccess={orderDataAccess} />,
});

const manageOrderRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.MANAGE_ORDERS.pattern,
    loader: async ({ params }: { params: IManageOrderParams }): Promise<ManageOrderLoaderData> => {
        const id = params.id;

        const response = await TanstackRouterUtils.handleRequest(orderDataAccess.readOrder({ id: id }));
        if (!response.ok) {
            await TanstackRouterUtils.handleInvalidResponse(response);
        }

        const dto: IReadOrderResponseDTO = await response.json();
        return {
            order: orderMapper.apiToDomain(dto.order),
        };
    },
    component: () => <ManageOrderRoute orderDataAccess={orderDataAccess} />,
});

export default [listOrdersRoute, createOrderRoute, manageOrderRoute];
