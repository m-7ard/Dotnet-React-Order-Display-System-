import OrdersPage from "./Orders.Page";
import useRouterLoaderData from "../../hooks/useRouterLoaderData";

export default function OrdersController() {
    const { orders } = useRouterLoaderData((keys) => keys.LIST_ORDERS);
    return <OrdersPage orders={orders} />;
}
