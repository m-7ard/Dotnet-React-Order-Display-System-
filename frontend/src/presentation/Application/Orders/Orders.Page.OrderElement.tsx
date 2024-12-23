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
        <MixinPrototypeCard options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }} className="overflow-hidden shrink-0 max-w-72 w-full sm:max-h-full flex flex-col" hasShadow hasDivide>
            <MixinPrototypeCardSection className={`flex flex-col ${ORDER_STATUS_COLORS[order.status.value]}`}>
                <div className="flex flex-row justify-between items-baseline">
                    <div className="text-base font-semibold">Order #{order.serialNumber}</div>
                    <div className="text-base font-semibold">{`${order.status.value}`}</div>
                </div>
                <div className="flex flex-row justify-between items-baseline">
                    <div className="text-sm">{order.dateCreated.toLocaleTimeString()}</div>
                    <div className="text-sm">{order.total}$</div>
                </div>
            </MixinPrototypeCardSection>
            {order.orderItems.map((orderItem, i) => (
                <MixinPrototypeCardSection className={`flex flex-col gap-3 ${i === 0 ? "" : "border-gray-900 border-t"}`} key={orderItem.id}>
                    <div className="flex flex-col gap-1">
                        <div className="token-card--list">
                            <div className="flex flex-row gap-[inherit] items-center">
                                <MixinButton
                                    options={{
                                        size: "mixin-button-sm",
                                        theme: "theme-button-generic-white",
                                    }}
                                    isStatic
                                >
                                    x{orderItem.quantity}
                                </MixinButton>
                                <div className="text-base font-semibold">{orderItem.productHistory.name}</div>
                            </div>
                            <div className="text-base">{`${orderItem.productHistory.price}$`}</div>
                        </div>
                        <div className="token-card--list">
                            <div className="flex flex-row gap-[inherit] items-center">
                                <button className={`mixin-button-like mixin-button-like--static mixin-button-sm ${ORDER_ITEM_STATUS_COLORS[orderItem.status.value]}`}>{orderItem.status.value}</button>
                            </div>
                            <div className="text-base">Total - {`${orderItem.getTotal()}$`}</div>
                        </div>
                    </div>
                </MixinPrototypeCardSection>
            ))}

            <MixinPrototypeCardSection
                as="a"
                onClick={(e) => {
                    e.preventDefault();
                    navigate({ to: `/orders/${order.id}/manage` });
                }}
                className="flex flex-row shrink-0"
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
