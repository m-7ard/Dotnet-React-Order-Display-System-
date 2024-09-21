import { Link, useLoaderData, useNavigate } from "@tanstack/react-router";
import { useApplicationExceptionContext } from "../../contexts/ApplicationExceptionHandlerContext";
import { useEffect } from "react";
import MixinButton from "../../components/Resuables/MixinButton";
import { useStateManagersContext } from "../../contexts/StateManagersContext";
import Order from "../../../domain/models/Order";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../components/Resuables/MixinPrototypeCard";
import AbstractDialog from "../../components/Resuables/AbstractDialog";
import FilterProductsDialogPanel from "./_OrdersPage/FilterOrdersDialogPanel";
import StatelessListBox from "../../components/StatelessFields/StatelessListBox";
import OrderStatus from "../../../domain/valueObjects/Order/OrderStatus";

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
                <AbstractDialog
                    Trigger={({ open, onToggle }) => (
                        <MixinButton
                            className="justify-center w-full rounded shadow basis-1/2"
                            options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                            active={open}
                            onClick={onToggle}
                        >
                            Filter
                        </MixinButton>
                    )}
                    Panel={<FilterProductsDialogPanel />}
                />
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
        <MixinPrototypeCard
            options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }}
            className="rounded shadow"
        >
            <MixinPrototypeCardSection className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-baseline">
                    <div className="text-base font-bold">Order #{order.id}</div>
                    <div className="text-sm">{`${order.status.value}`}</div>
                </div>
                <hr className="h-0 w-full border-bottom border-gray-900"></hr>
                <div className="flex flex-col gap-1 text-sm">
                    <div className="font-bold">Total</div>
                    <div className="p-0.5 px-2 bg-gray-900 text-white font-bold rounded shadow w-fit">{order.total}$</div>
                </div>
            </MixinPrototypeCardSection>
            {order.orderItems.map((orderItem) => (
                <MixinPrototypeCardSection className="flex flex-col gap-2" key={orderItem.id}>
                    <div className="flex flex-col gap-1 w-full">
                        <div>
                            <div className="text-sm font-semibold">Order Item #{orderItem.id}</div>
                            <div className="text-sm">{`${orderItem.status.value}`}</div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <div>
                            <span className="text-sm">Product:{" "}</span>
                            <span className="text-sm">{`${orderItem.productHistory.name}`}</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center text-sm">
                            <div className="p-0.5 px-2 bg-gray-900 text-white font-bold rounded shadow">
                                x{orderItem.quantity}
                            </div>{" "}
                            <div className="p-0.5 px-2 bg-gray-900 text-white font-bold rounded shadow">
                                {orderItem.productHistory.price}$
                            </div>{" "}
                        </div>
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
