import OrderItemStatus from "../valueObjects/OrderItem/OrderItemStatus";
import IProductHistory from "./IProductHistory";

export default interface IOrderItem {
    id: number;
    quantity: number;
    status: OrderItemStatus;
    dateCreated: Date;
    dateFinished: Date;
    orderId: IOrderItem["id"];
    productHistory: IProductHistory;
}