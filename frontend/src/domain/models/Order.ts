import OrderStatus from "../valueObjects/Order/OrderStatus";
import OrderItemStatus from "../valueObjects/OrderItem/OrderItemStatus";
import IOrderItem from "./IOrderItem";

export default class Order {
    constructor(props: {
        id: number;
        total: number;
        status: OrderStatus;
        dateCreated: Date;
        dateFinished: Date;
        orderItems: IOrderItem[];
    }) {
        this.id = props.id;
        this.total = props.total;
        this.status = props.status;
        this.dateCreated = props.dateCreated;
        this.dateFinished = props.dateFinished;
        this.orderItems = props.orderItems;
    }

    public id: number;
    public total: number;
    public status: OrderStatus;
    public dateCreated: Date;
    public dateFinished: Date;
    public orderItems: IOrderItem[];

    canMarkFinished(): boolean {
        return this.orderItems.every((orderItem) => orderItem.status === OrderItemStatus.FINISHED);
    }
}