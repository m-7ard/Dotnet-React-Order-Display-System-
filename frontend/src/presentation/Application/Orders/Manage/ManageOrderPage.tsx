import { Navigate, useLoaderData, useParams } from "@tanstack/react-router";
import { useApplicationExceptionContext } from "../../../contexts/ApplicationExceptionHandlerContext";
import { useEffect } from "react";
import CoverImage from "../../../components/Resuables/CoverImage";
import MixinButton from "../../../components/Resuables/MixinButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import MarkOrderItemFinishedCommand from "../../../../application/commands/orderItems/markFinished/MarkOrderItemFinishedCommand";
import { useCommandDispatcherContext } from "../../../contexts/CommandDispatcherContext";
import IOrderItem from "../../../../domain/models/IOrderItem";
import { useStateManagersContext } from "../../../contexts/StateManagersContext";
import useItemManager from "../../../hooks/useItemManager";
import IFormError from "../../../../domain/models/IFormError";
import apiToDomainCompatibleFormError from "../../../../application/mappers/apiToDomainCompatibleFormError";
import MarkOrderFinishedCommand from "../../../../application/commands/orders/markFinished/MarkOrderFinishedCommand";
import OrderStatus from "../../../../domain/valueObjects/Order/OrderStatus";
import OrderItemStatus from "../../../../domain/valueObjects/OrderItem/OrderItemStatus";

export default function ManageOrderPage() {
    const { id } = useParams({ from: "/orders/$id/manage" });
    const { ok, data } = useLoaderData({ from: "/orders/$id/manage" });

    const { dispatchException } = useApplicationExceptionContext();
    const { commandDispatcher } = useCommandDispatcherContext();
    const { orderStateManager } = useStateManagersContext();
    const errorsManager = useItemManager<IFormError<Record<string, unknown>>>({ _: undefined });

    const orderQuery = useQuery({
        queryKey: ["order", parseInt(id)],
        queryFn: () => (ok ? data : null),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        gcTime: 0,
    });

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

    useEffect(() => {
        if (!ok) {
            dispatchException(data);
        }
    }, [ok, dispatchException, data]);

    if (!ok) {
        return <Navigate to="/orders" />;
    }

    const order = orderQuery.data ?? data;

    return (
        <div className="mixin-page-like mixin-page-base">
            <header className="text-2xl text-gray-900 font-bold">Manage Order</header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <div className="mixin-Pcard-like mixin-Pcard-base theme-Pcard-generic-white rounded shadow">
                <div className="p-2 px-4 flex flex-col gap-2" data-role="section">
                    <div className="flex flex-row justify-between items-baseline">
                        <div className="text-base font-bold">Order #{order.id}</div>
                        <div className="text-sm">{`${order.status.value}`}</div>
                    </div>
                    <div className="flex flex-row gap-2">
                        {order.status === OrderStatus.PENDING && (
                            <>
                                <MixinButton
                                    className={`basis-1/2 justify-center rounded shadow ${order.canMarkFinished() ? "" : "contrast-50 cursor-not-allowed"}`}
                                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-green" }}
                                    onClick={() => markOrderFinishedMutation.mutate()}
                                >
                                    Mark Finished
                                </MixinButton>
                                <MixinButton
                                    className="basis-1/2 justify-center rounded shadow"
                                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                >
                                    Other Options
                                </MixinButton>
                            </>
                        )}
                        {order.status === OrderStatus.FINISHED && (
                            <>
                                <MixinButton
                                    className="basis-1/2 justify-center rounded shadow"
                                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                >
                                    Order Progress
                                </MixinButton>
                                <MixinButton
                                    className="basis-1/2 justify-center rounded shadow"
                                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                >
                                    Other Options
                                </MixinButton>
                            </>
                        )}
                    </div>
                </div>
                {order.orderItems.map((orderItem) => (
                    <OrderItem orderItem={orderItem} key={orderItem.id} />
                ))}
            </div>
        </div>
    );
}

function OrderItem(props: { orderItem: IOrderItem }) {
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
        <div className="flex flex-col gap-2" data-role="section">
            <div className="w-full grid grid-cols-4 grid-rows-1 shrink-0 gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                    <CoverImage
                        className="row-span-1 col-span-1 aspect-square border border-gray-300 rounded shadow overflow-hidden"
                        src={
                            orderItem.productHistory.images[i] == null
                                ? undefined
                                : `${import.meta.env.VITE_API_URL}/Media/${orderItem.productHistory.images[i]}`
                        }
                        key={i}
                    />
                ))}
            </div>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <div className="flex flex-col gap-1 grow">
                <div>
                    <div className="text-sm font-semibold">Order Item #{orderItem.id}</div>
                    <div className="text-sm">{`${orderItem.status.value}`}</div>
                </div>
            </div>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <div className="text-sm font-bold">{`${orderItem.productHistory.name}`}</div>
            <div className="flex flex-row gap-2 items-center text-sm">
                <div className="p-0.5 px-2 bg-gray-900 text-white font-bold rounded shadow">x{orderItem.quantity}</div>{" "}
                <div className="p-0.5 px-2 bg-gray-900 text-white font-bold rounded shadow">
                    {orderItem.productHistory.price}$
                </div>{" "}
            </div>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <div className="flex flex-row gap-2">
                {orderItem.status === OrderItemStatus.PENDING && (
                    <>
                        <MixinButton
                            className="basis-1/2 justify-center rounded shadow"
                            options={{ size: "mixin-button-sm", theme: "theme-button-generic-green" }}
                            onClick={() => markOrderItemFinishedMutation.mutate()}
                        >
                            Mark Finished
                        </MixinButton>
                        <MixinButton
                            className="basis-1/2 justify-center rounded shadow"
                            options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                        >
                            Other Options
                        </MixinButton>
                    </>
                )}
                {orderItem.status === OrderItemStatus.FINISHED && (
                    <>
                        <MixinButton
                            className="basis-1/2 justify-center rounded shadow"
                            options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                        >
                            Item Progress
                        </MixinButton>
                        <MixinButton
                            className="basis-1/2 justify-center rounded shadow"
                            options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                        >
                            Other Options
                        </MixinButton>
                    </>
                )}
            </div>
        </div>
    );
}
