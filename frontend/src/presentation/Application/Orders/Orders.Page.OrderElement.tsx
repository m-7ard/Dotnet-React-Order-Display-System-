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
        <MixinPrototypeCard options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }} className="overflow-hidden shrink-0 max-w-72 w-full sm:max-h-full flex flex-col">
            <MixinPrototypeCardSection className={`flex flex-col ${ORDER_STATUS_COLORS[order.status.value]}`}>
                <div className="flex flex-row justify-between items-baseline">
                    <div className="token-card--header--primary-text">Order #{order.serialNumber}</div>
                    <div className="token-card--header--tertiary-text">{`${order.status.value}`}</div>
                </div>
                <div className="flex flex-row justify-between items-baseline">
                    <div className="token-card--header--secondary-text">{order.dateCreated.toLocaleTimeString()}</div>
                    <div className="token-card--header--secondary-text">{order.total}$</div>
                </div>
            </MixinPrototypeCardSection>
            {order.orderItems.map((orderItem, i) => (
                <MixinPrototypeCardSection className={`flex flex-col gap-2 ${i === 0 ? "" : "border-gray-900 border-t"}`} key={orderItem.id}>
                    <div className="flex flex-col gap-1 overflow-hidden max-w-full">
                        <div className="token-card--list">
                            <span className="flex flex-row gap-[inherit] items-center">
                                <div className="text-sm font-bold bg-gray-200 px-2 py-1/2 rounded-lg">x{orderItem.quantity}</div>
                                <div className="token-card--list-label--text truncate">{orderItem.productHistory.name}</div>
                            </span>
                            <span className="token-card--list-value--text">{`${orderItem.productHistory.price}$`}</span>
                        </div>
                        <div className="token-card--list">
                            <div className={`text-sm ${ORDER_ITEM_STATUS_COLORS[orderItem.status.value]} border px-2 py-px rounded-lg`}>{orderItem.status.value}</div>
                            <div className="token-card--list-value--text">Total - {`${orderItem.getTotal()}$`}</div>
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
