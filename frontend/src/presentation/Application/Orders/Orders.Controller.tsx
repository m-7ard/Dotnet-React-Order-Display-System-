import OrdersPage from "./Orders.Page";
import useRouterLoaderData from "../../hooks/useRouterLoaderData";
import { IListOrdersLoaderData } from "../../routes/tanstack/children/orders/orderRoutes";

export default function OrdersController() {
    const { orders } = useRouterLoaderData<IListOrdersLoaderData>((keys) => keys.LIST_ORDERS);
    return <OrdersPage orders={orders} />;
}
