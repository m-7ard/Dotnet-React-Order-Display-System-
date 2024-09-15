import { QueryClient } from "@tanstack/react-query";
import IOrderStateManager from "../../application/interfaces/stateManagers/IOrderStateManager";
import Order from "../../domain/models/Order";

export default class OrderStateManager implements IOrderStateManager {
    private readonly _queryClient: QueryClient;
    
    constructor(props: {
        queryClient: QueryClient
    }) {
        this._queryClient = props.queryClient;
    }

    setOrder(order: Order): void {
        this._queryClient.setQueryData(["order", order.id], order);
    }

    getOrder(orderId: Order["id"]): Order | null {
        return this._queryClient.getQueryData(["order", orderId]) ?? null;
    }
}