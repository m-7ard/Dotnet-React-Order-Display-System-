import { useApplicationExceptionContext } from "../../../contexts/ApplicationExceptionHandlerContext";
import CoverImage from "../../../components/Resuables/CoverImage";
import MixinButton from "../../../components/Resuables/MixinButton";
import { useMutation } from "@tanstack/react-query";
import MarkOrderItemFinishedCommand from "../../../../application/commands/orderItems/markFinished/MarkOrderItemFinishedCommand";
import { useCommandDispatcherContext } from "../../../contexts/CommandDispatcherContext";
import OrderItem from "../../../../domain/models/OrderItem";
import { useStateManagersContext } from "../../../contexts/StateManagersContext";
import useItemManager from "../../../hooks/useItemManager";
import IFormError from "../../../../domain/models/IFormError";
import apiToDomainCompatibleFormError from "../../../../application/mappers/apiToDomainCompatibleFormError";
import MarkOrderFinishedCommand from "../../../../application/commands/orders/markFinished/MarkOrderFinishedCommand";
import OrderStatus from "../../../../domain/valueObjects/Order/OrderStatus";
import OrderItemStatus from "../../../../domain/valueObjects/OrderItem/OrderItemStatus";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../../components/Resuables/MixinPrototypeCard";
import Linkbox from "../../../components/Resuables/LinkBox";
import Order from "../../../../domain/models/Order";

const ORDER_ITEM_STATUS_COLORS = {
    [OrderItemStatus.FINISHED.value]: "bg-green-600/50",
    [OrderItemStatus.PENDING.value]: "bg-orange-400/70",
};

const ORDER_STATUS_COLORS = {
    [OrderStatus.FINISHED.value]: "bg-green-600/50",
    [OrderStatus.PENDING.value]: "bg-orange-400/70",
};

export default function ManageOrderPage(props: { order: Order }) {
    const { order } = props;
    const { dispatchException } = useApplicationExceptionContext();
    const { commandDispatcher } = useCommandDispatcherContext();
    const { orderStateManager } = useStateManagersContext();
    const errorsManager = useItemManager<IFormError<Record<string, unknown>>>({ _: undefined });

    const markOrderFinishedMutation = useMutation({
        mutationFn: async () => {
            if (!order.canMarkFinished()) {
                return;
            }

            const command = new MarkOrderFinishedCommand({ orderId: order.id });
            const result = await commandDispatcher.dispatch(command);

            if (result.isOk()) {
                orderStateManager.setOrder(result.value.order);
            } else if (result.error.type === "Exception") {
                dispatchException(result.error.data);
            } else if (result.error.type === "API") {
                errorsManager.setAll(apiToDomainCompatibleFormError(result.error.data));
            }
        },
    });

    return (
        <div className="mixin-page-like mixin-page-base">
            <header className="flex flex-row gap-2 items-center">
                <Linkbox
                    parts={[
                        { isLink: true, to: "/orders", label: "Orders" },
                        { isLink: false, label: order.id },
                        { isLink: true, to: `/orders/${order.id}/manage`, label: "Manage" },
                    ]}
                />
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <MixinPrototypeCard
                options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }}
                className=" "
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
                <MixinPrototypeCardSection className="bg-gray-100">
                    <div className="flex flex-row gap-1">
                        {order.status === OrderStatus.PENDING && (
                            <>
                                <MixinButton
                                    className={`basis-1/2 justify-center   ${order.canMarkFinished() ? "" : "contrast-50 cursor-not-allowed"}`}
                                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-green" }}
                                    onClick={() => markOrderFinishedMutation.mutate()}
                                >
                                    Mark Finished
                                </MixinButton>
                                <MixinButton
                                    className="basis-1/2 justify-center  "
                                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                >
                                    Other Options
                                </MixinButton>
                            </>
                        )}
                        {order.status === OrderStatus.FINISHED && (
                            <>
                                <MixinButton
                                    className="basis-1/2 justify-center  "
                                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                >
                                    Order Progress
                                </MixinButton>
                                <MixinButton
                                    className="basis-1/2 justify-center  "
                                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                >
                                    Other Options
                                </MixinButton>
                            </>
                        )}
                    </div>
                </MixinPrototypeCardSection>
            </MixinPrototypeCard>
            {order.orderItems.map((orderItem) => (
                <OrderItemElement orderItem={orderItem} key={orderItem.id} />
            ))}
        </div>
    );
}

function OrderItemElement(props: { orderItem: OrderItem }) {
    const { orderItem } = props;

    const { dispatchException } = useApplicationExceptionContext();
    const { commandDispatcher } = useCommandDispatcherContext();
    const { orderStateManager } = useStateManagersContext();
    const errorsManager = useItemManager<IFormError<Record<string, unknown>>>({ _: undefined });

    const markOrderItemFinishedMutation = useMutation({
        mutationFn: async () => {
            const command = new MarkOrderItemFinishedCommand({ orderId: orderItem.orderId, orderItemId: orderItem.id });
            const result = await commandDispatcher.dispatch(command);

            if (result.isOk()) {
                orderStateManager.setOrder(result.value.order);
            } else if (result.error.type === "Exception") {
                dispatchException(result.error.data);
            } else if (result.error.type === "API") {
                errorsManager.setAll(apiToDomainCompatibleFormError(result.error.data));
            }
        },
    });

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
                    <div className="text-sm">Order Item #{orderItem.id}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-col gap-1">
                <div className="w-full flex flex-row justify-between px-2 py-1 bg-gray-100 shrink-0  border border-gray-900">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <CoverImage
                            className="h-12 w-12 border border-gray-900  overflow-hidden bg-gray-50"
                            src={
                                orderItem.productHistory.images[i] == null
                                    ? undefined
                                    : `${import.meta.env.VITE_API_URL}/Media/${orderItem.productHistory.images[i]}`
                            }
                            key={i}
                        />
                    ))}
                </div>
                <div className="flex flex-row gap-2 items-center text-base">
                    <div className="text-sm font-bold bg-gray-200 px-2 py-1/2  border border-gray-900">
                        x{orderItem.quantity}
                    </div>
                    <div className="text-sm truncate">{orderItem.productHistory.name}</div>
                    <div className="text-sm ml-auto">{`${orderItem.productHistory.price}$`}</div>
                </div>
                <div className="flex flex-row gap-2 items-center text-base">
                    <div
                        className={`text-sm ${ORDER_ITEM_STATUS_COLORS[orderItem.status.value]} border border-gray-900 px-2 py-px `}
                    >
                        {orderItem.status.value}
                    </div>
                    <div className="text-sm ml-auto">
                        Total - {`${orderItem.getTotal()}$`}
                    </div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="bg-gray-100">
                <div className="flex flex-col gap-1 overflow-hidden max-w-full">
                    <div className="flex flex-row gap-1">
                        {orderItem.status === OrderItemStatus.PENDING && (
                            <>
                                <MixinButton
                                    className="basis-1/2 justify-center  "
                                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-green" }}
                                    onClick={() => markOrderItemFinishedMutation.mutate()}
                                >
                                    Mark Finished
                                </MixinButton>
                                <MixinButton
                                    className="basis-1/2 justify-center  "
                                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                >
                                    Other Options
                                </MixinButton>
                            </>
                        )}
                        {orderItem.status === OrderItemStatus.FINISHED && (
                            <>
                                <MixinButton
                                    className="basis-1/2 justify-center  "
                                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                >
                                    Item Progress
                                </MixinButton>
                                <MixinButton
                                    className="basis-1/2 justify-center  "
                                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                >
                                    Other Options
                                </MixinButton>
                            </>
                        )}
                    </div>
                </div>
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
