import OrderItem from "../../../../domain/models/OrderItem";
import OrderItemStatus from "../../../../domain/valueObjects/OrderItem/OrderItemStatus";
import { getApiUrl } from "../../../../viteUtils";
import CoverImage from "../../../components/Resuables/CoverImage";
import MixinButton from "../../../components/Resuables/MixinButton";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../../components/Resuables/MixinPrototypeCard";

const ORDER_ITEM_STATUS_COLORS = {
    [OrderItemStatus.FINISHED.value]: "bg-green-600/50",
    [OrderItemStatus.PENDING.value]: "bg-orange-400/70",
};

export default function OrderItemElement(props: { orderItem: OrderItem; onMarkOrderItenFinished: () => void }) {
    const { orderItem, onMarkOrderItenFinished } = props;

    return (
        <MixinPrototypeCard
            key={orderItem.id}
            options={{
                size: "mixin-Pcard-base",
                theme: "theme-Pcard-generic-white",
            }}
            hasDivide
            hasShadow
        >
            <MixinPrototypeCardSection className={`flex flex-col ${ORDER_ITEM_STATUS_COLORS[orderItem.status.value]}`}>
                <div className="flex flex-row justify-between items-baseline">
                    <div className="token-card--header--primary-text">Order Item #{orderItem.serialNumber}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-col gap-3">
                <div className="w-full flex flex-row justify-between p-1 shrink-0 border token-default-border-color h-16 rounded-lg">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <CoverImage className="token-default-avatar" src={orderItem.productHistory.images[i] == null ? undefined : `${getApiUrl()}/Media/${orderItem.productHistory.images[i]}`} key={i} />
                    ))}
                </div>
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
                            <div className="token-card--list-label--text">{orderItem.productHistory.name}</div>
                        </div>
                        <div className="token-card--list-value--text">{`${orderItem.productHistory.price}$`}</div>
                    </div>
                    <div className="token-card--list">
                        <div className="flex flex-row gap-[inherit] items-center">
                            <button className={`mixin-button-like mixin-button-like--static mixin-button-sm ${ORDER_ITEM_STATUS_COLORS[orderItem.status.value]}`}>{orderItem.status.value}</button>
                        </div>
                        <div className="token-card--list-value--text">Total - {`${orderItem.getTotal()}$`}</div>
                    </div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection>
                <div className="flex flex-row gap-3">
                    {orderItem.canMarkFinished() && (
                        <>
                            <MixinButton className="basis-1/2 justify-center" options={{ size: "mixin-button-sm", theme: "theme-button-generic-green" }} onClick={onMarkOrderItenFinished}>
                                Mark Finished
                            </MixinButton>
                            <MixinButton className="basis-1/2 justify-center" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}>
                                Other Options
                            </MixinButton>
                        </>
                    )}
                    {orderItem.status === OrderItemStatus.FINISHED && (
                        <>
                            <MixinButton className="basis-1/2 justify-center" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}>
                                Item Progress
                            </MixinButton>
                            <MixinButton className="basis-1/2 justify-center" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}>
                                Other Options
                            </MixinButton>
                        </>
                    )}
                </div>
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
