import OrderItemStatus from "../valueObjects/OrderItem/OrderItemStatus";
import IProductHistory from "./IProductHistory";
import Order from "./Order";

export default class OrderItem {
    constructor(props: {
        id: number;
        quantity: number;
        status: OrderItemStatus;
        dateCreated: Date;
        dateFinished: Date;
        orderId: Order["id"];
        productHistory: IProductHistory;
    }) {
        this.id = props.id;
        this.quantity = props.quantity;
        this.status = props.status;
        this.dateCreated = props.dateCreated;
        this.dateFinished = props.dateFinished;
        this.orderId = props.orderId;
        this.productHistory = props.productHistory;
    }

    getTotal(): number {
        return Math.round(this.productHistory.price * this.quantity * 100) / 100;
    }
    
    canMarkFinished(): boolean {
        return this.status === OrderItemStatus.PENDING;
    }

    public id: number;
    public quantity: number;
    public status: OrderItemStatus;
    public dateCreated: Date;
    public dateFinished: Date;
    public orderId: Order["id"];
    public productHistory: IProductHistory;
}