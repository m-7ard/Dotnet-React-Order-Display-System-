import { QueryClient } from "@tanstack/react-query";
import IOrderStateManager from "../../application/interfaces/IOrderStateManager";
import IOrder from "../../domain/models/IOrder";

export default class OrderStateManager implements IOrderStateManager {
    private readonly _queryClient: QueryClient;
    
    constructor(props: {
        queryClient: QueryClient
    }) {
        this._queryClient = props.queryClient;
    }

    setOrder(order: IOrder): void {
        this._queryClient.setQueryData(["order", order.id], order);
    }

    getOrder(orderId: IOrder["id"]): IOrder | null {
        return this._queryClient.getQueryData(["order", orderId]) ?? null;
    }
}