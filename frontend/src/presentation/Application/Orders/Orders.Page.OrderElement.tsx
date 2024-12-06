import { useNavigate } from "@tanstack/react-router";
import Order from "../../../domain/models/Order";
import MixinButton from "../../components/Resuables/MixinButton";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../components/Resuables/MixinPrototypeCard";
import OrderStatus from "../../../domain/valueObjects/Order/OrderStatus";
import OrderItemStatus from "../../../domain/valueObjects/OrderItem/OrderItemStatus";

const ORDER_ITEM_STATUS_COLORS = {
    [OrderItemStatus.FINISHED.value]: "bg-green-600/40",
    [OrderItemStatus.PENDING.value]: "bg-orange-400/60",
};

const ORDER_STATUS_COLORS = {
    [OrderStatus.FINISHED.value]: "bg-green-600/40",
    [OrderStatus.PENDING.value]: "bg-orange-400/60",
};

export default function OrderElement(props: { order: Order }) {
    const { order } = props;
    const navigate = useNavigate();

    return (
        <MixinPrototypeCard
            options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }}
            className="overflow-hidden shrink-0 max-w-72 w-full sm:max-h-full flex flex-col"
        >
            <MixinPrototypeCardSection className={`flex flex-col ${ORDER_STATUS_COLORS[order.status.value]}`}>
                <div className="flex flex-row justify-between items-baseline">
                    <div className="text-sm">Order #{order.serialNumber}</div>
                    <div className="text-sm">{`${order.status.value}`}</div>
                </div>
                <div className="flex flex-row justify-between items-baseline">
                    <div className="text-sm">{order.dateCreated.toLocaleTimeString()}</div>
                    <div className="text-sm">{order.total}$</div>
                </div>
            </MixinPrototypeCardSection>
            <div className=" sm:overflow-auto">
                {order.orderItems.map((orderItem, i) => (
                    <MixinPrototypeCardSection
                        className={`flex flex-col gap-2 ${i === 0 ? "" : "border-gray-900 border-t"}`}
                        key={orderItem.id}
                    >
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
                                <div className="text-sm ml-auto">Total - {`${orderItem.getTotal()}$`}</div>
                            </div>
                        </div>
                    </MixinPrototypeCardSection>
                ))}
            </div>

            <MixinPrototypeCardSection
                as="a"
                onClick={(e) => {
                    e.preventDefault();
                    navigate({ to: `/orders/${order.id}/manage` });
                }}
                className="flex flex-row bg-gray-100 shrink-0"
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