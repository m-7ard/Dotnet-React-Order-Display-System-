import { Link, useLoaderData, useNavigate } from "@tanstack/react-router";
import { useApplicationExceptionContext } from "../../contexts/ApplicationExceptionHandlerContext";
import { useEffect } from "react";
import MixinButton from "../../components/Resuables/MixinButton";
import { useStateManagersContext } from "../../contexts/StateManagersContext";
import Order from "../../../domain/models/Order";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../components/Resuables/MixinPrototypeCard";

export default function OrdersPage() {
    const { ordersResult } = useLoaderData({ from: "/orders" });
    const { dispatchException } = useApplicationExceptionContext();

    useEffect(() => {
        if (ordersResult.isErr() && ordersResult.error.type === "Exception") {
            dispatchException(ordersResult.error.data);
        }
    }, [dispatchException, ordersResult]);

    const queryData = ordersResult.isOk() ? ordersResult.value.orders : [];

    return (
        <div className="mixin-page-like mixin-page-base">
            <header className="text-2xl text-gray-900 font-bold">Orders</header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <div className="flex flex-row gap-2">
                <Link to="/orders/create" className="basis-1/2">
                    <MixinButton
                        className="justify-center w-full rounded shadow"
                        options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                    >
                        Create
                    </MixinButton>
                </Link>
                <MixinButton
                    className="justify-center w-full rounded shadow basis-1/2"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                >
                    Filter
                </MixinButton>
            </div>
            {queryData.map((order) => (
                <OrderElement order={order} key={order.id} />
            ))}
        </div>
    );
}

function OrderElement(props: { order: Order }) {
    const { order } = props;
    const navigate = useNavigate();
    const { orderStateManager } = useStateManagersContext();

    return (
        <MixinPrototypeCard options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }} className="rounded shadow">
            <MixinPrototypeCardSection className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-baseline">
                    <div className="text-base font-bold">Order #{order.id}</div>
                    <div className="text-sm">{`${order.status.value}`}</div>
                </div>
            </MixinPrototypeCardSection>
            {order.orderItems.map((orderItem) => (
                <MixinPrototypeCardSection className="flex flex-col gap-2" key={orderItem.id}>
                    <div className="flex flex-col gap-1 grow">
                        <div>
                            <div className="text-sm font-semibold">Order Item #{orderItem.id}</div>
                            <div className="text-sm">{`${orderItem.status}`}</div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center text-sm">
                        <div className="p-0.5 px-2 bg-gray-900 text-white font-bold rounded shadow">
                            x{orderItem.quantity}
                        </div>{" "}
                        <div>{`${orderItem.productHistory.name}`}</div>
                    </div>
                </MixinPrototypeCardSection>
            ))}
            <MixinPrototypeCardSection className="flex flex-col gap-2">
                <a
                    className="w-full"
                    onClick={(e) => {
                        e.preventDefault();
                        orderStateManager.setOrder(order);
                        navigate({ to: `/orders/${order.id}/manage` });
                    }}
                >
                    <MixinButton
                        className="justify-center w-full rounded shadow"
                        options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }}
                    >
                        Manage Order
                    </MixinButton>
                </a>
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
