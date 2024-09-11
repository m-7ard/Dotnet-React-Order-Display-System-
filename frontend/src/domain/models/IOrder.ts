import OrderStatus from "../valueObjects/Order/OrderStatus";
import IOrderItem from "./IOrderItem";

export default interface IOrder {
    id: number;
    total: number;
    status: OrderStatus;
    dateCreated: Date;
    dateFinished: Date;
    orderItems: IOrderItem[];
}