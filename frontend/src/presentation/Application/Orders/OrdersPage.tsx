import { Link, useLoaderData, useNavigate } from "@tanstack/react-router";
import { useApplicationExceptionContext } from "../../contexts/ApplicationExceptionHandlerContext";
import { useEffect } from "react";
import MixinButton from "../../components/Resuables/MixinButton";
import { useStateManagersContext } from "../../contexts/StateManagersContext";
import Order from "../../../domain/models/Order";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../components/Resuables/MixinPrototypeCard";
import FilterProductsDialogPanel from "./_OrdersPage/FilterOrdersDialogPanel";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import OrderStatus from "../../../domain/valueObjects/Order/OrderStatus";
import OrderItemStatus from "../../../domain/valueObjects/OrderItem/OrderItemStatus";
import Linkbox from "../../components/Resuables/LinkBox";

const ORDER_ITEM_STATUS_COLORS = {
    [OrderItemStatus.FINISHED.value]: "bg-green-600/40",
    [OrderItemStatus.PENDING.value]: "bg-orange-400/60",
};

const ORDER_STATUS_COLORS = {
    [OrderStatus.FINISHED.value]: "bg-green-600/40",
    [OrderStatus.PENDING.value]: "bg-orange-400/60",
};

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
            <header className="flex flex-row gap-2 items-center">
                <Linkbox parts={[{ isLink: true, to: "/orders", label: "Orders" }]} />
                <div className="flex flex-row gap-2 ml-auto">
                    <Link to="/orders/create">
                        <MixinButton
                            className=""
                            options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                        >
                            Create
                        </MixinButton>
                    </Link>
                    <GlobalDialog
                        zIndex={10}
                        Trigger={({ onToggle }) => (
                            <MixinButton
                                className=" basis-1/2"
                                options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                onClick={onToggle}
                            >
                                Filter
                            </MixinButton>
                        )}
                        Panel={FilterProductsDialogPanel}
                        panelProps={{}}
                    />
                </div>
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <section className="flex flex-col overflow-auto  gap-4 p-4 bg-gray-100 border border-gray-900">
                {queryData.map((order) => (
                    <OrderElement order={order} key={order.id} />
                ))}
            </section>
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
            className="overflow-hidden  shrink-0"
        >
            <MixinPrototypeCardSection className={`flex flex-col ${ORDER_STATUS_COLORS[order.status.value]}`}>
                <div className="flex flex-row justify-between items-baseline">
                    <div className="text-sm">Order #{order.id}</div>
                    <div className="text-sm">{`${order.status.value}`}</div>
                </div>
                <div className="flex flex-row justify-between items-baseline">
                    <div className="text-sm">{order.dateCreated.toLocaleTimeString()}</div>
                    <div className="text-sm">{order.total}$</div>
                </div>
            </MixinPrototypeCardSection>
            {order.orderItems.map((orderItem) => (
                <MixinPrototypeCardSection className="flex flex-col gap-2" key={orderItem.id}>
                    <div className="flex flex-col gap-1 overflow-hidden max-w-full">
                        <div className="flex flex-row gap-2 items-center text-base">
                            <div className="text-sm font-bold bg-gray-200 px-2 py-1/2 border border-gray-900">
                                x{orderItem.quantity}
                            </div>
                            <div className="border-gray-900 text-sm truncate">{orderItem.productHistory.name}</div>
                            <div className="text-sm ml-auto">{`${orderItem.productHistory.price}$`}</div>
                        </div>
                        <div className="flex flex-row gap-2 items-center text-base">
                            <div
                                className={`text-sm ${ORDER_ITEM_STATUS_COLORS[orderItem.status.value]} border px-2 py-px  border border-gray-900`}
                            >
                                {orderItem.status.value}
                            </div>
                            <div className="text-sm ml-auto">
                                Total - {`${orderItem.getTotal()}$`}
                            </div>
                        </div>
                    </div>
                </MixinPrototypeCardSection>
            ))}
            <MixinPrototypeCardSection
                as="a"
                onClick={(e) => {
                    e.preventDefault();
                    orderStateManager.setOrder(order);
                    navigate({ to: `/orders/${order.id}/manage` });
                }}
                className="flex flex-row bg-gray-100"
            >
                <MixinButton
                    options={{
                        size: "mixin-button-base",
                        theme: "theme-button-generic-yellow",
                    }}
                    className="w-full justify-center"
                >
                    Manage Order
                </MixinButton>
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
