import IOrder from "../../domain/models/IOrder";

export default interface IOrderStateManager {
    setOrder(data: IOrder): void;
    getOrder(orderId: IOrder["id"]): IOrder | null;
}