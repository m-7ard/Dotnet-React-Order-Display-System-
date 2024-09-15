import Order from "../../../domain/models/Order";

export default interface IOrderStateManager {
    setOrder(data: Order): void;
    getOrder(orderId: Order["id"]): Order | null;
}