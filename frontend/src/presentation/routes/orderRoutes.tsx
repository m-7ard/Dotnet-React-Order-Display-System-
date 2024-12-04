import { createRoute, redirect } from "@tanstack/react-router";
import rootRoute from "./_rootRoute";
import Order from "../../domain/models/Order";
import ManageOrderRoute from "../Application/Orders/Manage/ManageOrder.Controller";
import routeData from "./_routeData";
import CreateOrderController from "../Application/Orders/Create/CreateOrder.Controller";
import { orderDataAccess } from "../deps/dataAccess";
import IListOrdersResponseDTO from "../../infrastructure/contracts/orders/list/IListOrdersResponseDTO";
import orderMapper from "../../infrastructure/mappers/orderMapper";
import OrdersController from "../Application/Orders/Orders.Controller";
import IReadOrderResponseDTO from "../../infrastructure/contracts/orders/read/IReadOrderResponseDTO";
import parseListOrdersCommandParameters from "../../infrastructure/parsers/parseListOrdersCommandParameters";

const baseOrdersRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.listOrders.pattern,
    loaderDeps: ({ search }: { search: Record<string, string> }) => search,
    loader: async ({ deps }) => {
        const parsedParams = parseListOrdersCommandParameters(deps);
        const response = await orderDataAccess.listOrders(parsedParams);

        if (!response.ok) {
            throw redirect({ to: "/" });
        }

        const data: IListOrdersResponseDTO = await response.json();

        return data.orders.map(orderMapper.apiToDomain);
    },
    component: OrdersController,
});

const createOrderRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.createOrder.pattern,
    component: () => <CreateOrderController orderDataAccess={orderDataAccess} />,
});

const manageOrderRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.manageOrder.pattern,
    loader: async ({ params }): Promise<Order> => {
        const id = params.id;
        const response = await orderDataAccess.readOrder({ id: id });

        if (!response.ok) {
            throw redirect({ "to": "/" });
        }

        const dto: IReadOrderResponseDTO = await response.json();
        return orderMapper.apiToDomain(dto.order);
    },
    component: () => <ManageOrderRoute orderDataAccess={orderDataAccess} />,
});

export default [baseOrdersRoute, createOrderRoute, manageOrderRoute];
