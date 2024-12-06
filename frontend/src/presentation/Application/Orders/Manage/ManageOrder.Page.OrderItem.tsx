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
        >
            <MixinPrototypeCardSection className={`flex flex-col ${ORDER_ITEM_STATUS_COLORS[orderItem.status.value]}`}>
                <div className="flex flex-row justify-between items-baseline">
                    <div className="text-sm">Order Item #{orderItem.serialNumber}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-col gap-1">
                <div className="w-full flex flex-row justify-between px-2 py-1 bg-gray-100 shrink-0  border border-gray-900">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <CoverImage className="h-12 w-12 border border-gray-900  overflow-hidden bg-gray-50" src={orderItem.productHistory.images[i] == null ? undefined : `${getApiUrl()}/Media/${orderItem.productHistory.images[i]}`} key={i} />
                    ))}
                </div>
                <div className="flex flex-row gap-2 items-center text-base">
                    <div className="text-sm font-bold bg-gray-200 px-2 py-1/2  border border-gray-900">x{orderItem.quantity}</div>
                    <div className="text-sm truncate">{orderItem.productHistory.name}</div>
                    <div className="text-sm ml-auto">{`${orderItem.productHistory.price}$`}</div>
                </div>
                <div className="flex flex-row gap-2 items-center text-base">
                    <div className={`text-sm ${ORDER_ITEM_STATUS_COLORS[orderItem.status.value]} border border-gray-900 px-2 py-px `}>{orderItem.status.value}</div>
                    <div className="text-sm ml-auto">Total - {`${orderItem.getTotal()}$`}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="bg-gray-100">
                <div className="flex flex-row gap-2">
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
