import { useQuery } from "@tanstack/react-query";
import { Link, useLoaderData } from "@tanstack/react-router";
import { useApplicationExceptionContext } from "../../contexts/ApplicationExceptionHandlerContext";
import { useEffect } from "react";
import IOrder from "../../../domain/models/IOrder";

export default function OrdersPage() {
    const { ordersResult } = useLoaderData({ from: "/orders" });
    const { dispatchException } = useApplicationExceptionContext();

    useEffect(() => {
        if (ordersResult.isErr() && ordersResult.error.type === "Exception") {
            dispatchException(ordersResult.error.data);
        }
    }, [dispatchException, ordersResult]);

    const queryData = ordersResult.isOk() ? ordersResult.value.orders : [];
    console.log("queryData: ", queryData);

    return (
        <div className="mixin-page-like mixin-page-base">
            <div className="text-2xl text-sky-600 font-medium">Orders</div>
            <hr className="h-0 w-full border-bottom border-dashed border-gray-800"></hr>
            <div className="p-1 flex flex-col gap-2 bg-gray-200 border border-gray-400">
                <div className="flex flex-row gap-2">
                    <Link to="/orders/create" className="mixin-button-like mixin-button-sm theme-button-generic-white">
                        Create
                    </Link>
                    <div className="mixin-button-like mixin-button-sm theme-button-generic-white">Filter</div>
                </div>
            </div>
            {queryData.map((order) => (
                <Order order={order} key={order.id} />
            ))}
        </div>
    );
}

function Order(props: { order: IOrder }) {
    const { order } = props;

    return (
        <div className="p-1 flex flex-col gap-1 bg-gray-200 border border-gray-400">
            <div className="text-sm">Order #{order.id}</div>
            <section className="flex flex-col gap-1">
                {order.orderItems.map((orderItem) => (
                    <ul className="flex flex-col gap-0.5" key={orderItem.id}>
                        <li>
                            <span className="text-sm font-semibold">Product:</span>{" "}
                            <span className="text-sm">{orderItem.productHistory.name}</span>
                        </li>
                    </ul>
                ))}
            </section>
        </div>
    );
}
