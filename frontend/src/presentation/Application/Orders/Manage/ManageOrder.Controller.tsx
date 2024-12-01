import { useLoaderData } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import ManageOrderPage from "./ManageOrder.Page";
import useResponseHandler from "../../../hooks/useResponseHandler";
import IPresentationError from "../../../../domain/models/IFormError";
import useItemManager from "../../../hooks/useItemManager";
import { err, ok } from "neverthrow";
import IPlainApiError from "../../../../infrastructure/interfaces/IPlainApiError";
import OrderItem from "../../../../domain/models/OrderItem";
import IOrderDataAccess from "../../../interfaces/dataAccess/IOrderDataAccess";
import OrderStatus from "../../../../domain/valueObjects/Order/OrderStatus";
import OrderItemStatus from "../../../../domain/valueObjects/OrderItem/OrderItemStatus";

export default function ManageOrderRoute(props: { orderDataAccess: IOrderDataAccess }) {
    const { orderDataAccess } = props;
    const order = useLoaderData({ from: "/orders/$id/manage" });
    const responseHandler = useResponseHandler();
    const errorsManager = useItemManager<IPresentationError<Record<string | number, unknown>>>({ _: undefined });

    const markOrderFinishedMutation = useMutation({
        mutationFn: async () => {
            if (!order.canMarkFinished()) {
                return;
            }

            errorsManager.setAll({});
            await responseHandler({
                requestFn: () =>
                    orderDataAccess.markOrderFinished({
                        orderId: order.id,
                    }),
                onResponseFn: async (response) => {
                    if (response.ok) {
                        order.status = OrderStatus.FINISHED;
                        return ok(undefined);
                    }

                    if (response.status === 400) {
                        const errors: IPlainApiError = await response.json();
                        errorsManager.updateItem(
                            "_",
                            errors.map(({ message }) => message),
                        );
                        return ok(undefined);
                    }

                    return err(undefined);
                },
            });
        },
    });

    const markOrderItemFinishedMutation = useMutation({
        mutationFn: async (variables: { orderItem: OrderItem }) => {
            const { orderItem } = variables;
            if (!orderItem.canMarkFinished()) {
                return;
            }

            errorsManager.setAll({});
            await responseHandler({
                requestFn: () =>
                    orderDataAccess.markOrderItemFinished({
                        orderId: order.id,
                        orderItemId: orderItem.id,
                    }),
                onResponseFn: async (response) => {
                    if (response.ok) {
                        orderItem.status = OrderItemStatus.FINISHED;
                        return ok(undefined);
                    }

                    if (response.status === 400) {
                        const errors: IPlainApiError = await response.json();
                        errorsManager.updateItem(
                            orderItem.id,
                            errors.map(({ message }) => message),
                        );
                        return ok(undefined);
                    }

                    return err(undefined);
                },
            });
        },
    });

    return <ManageOrderPage order={order} errors={errorsManager.items} onMarkFinished={markOrderFinishedMutation.mutate} onMarkOrderItemFinished={(orderItem) => markOrderItemFinishedMutation.mutate({ orderItem: orderItem })} />;
}
