import { useLoaderData } from "@tanstack/react-router";
import OrdersPage from "./Orders.Page";

export default function OrdersController() {
    const orders = useLoaderData({ from: "/orders" });
    return <OrdersPage orders={orders} />
}
