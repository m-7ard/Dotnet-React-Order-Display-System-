import Order from "../../../../domain/models/Order";
import OrderItem from "../../../../domain/models/OrderItem";
import ICommand from "../../ICommand";
import MarkOrderItemFinishedResult from "./MarkOrderItemFinishedResult";

export default class MarkOrderItemFinishedCommand implements ICommand<MarkOrderItemFinishedResult> {
    __returnType: MarkOrderItemFinishedResult = null!;

    constructor(props: {
        orderId: Order["id"];
        orderItemId: OrderItem["id"];
    }) {
        this.orderId = props.orderId;
        this.orderItemId = props.orderItemId;
    }

    public orderId: Order["id"];
    public orderItemId: OrderItem["id"];
}
