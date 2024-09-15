import Order from "../../../../domain/models/Order";
import IOrderItem from "../../../../domain/models/IOrderItem";
import ICommand from "../../ICommand";
import MarkOrderItemFinishedResult from "./MarkOrderItemFinishedResult";

export default class MarkOrderItemFinishedCommand implements ICommand<MarkOrderItemFinishedResult> {
    __returnType: MarkOrderItemFinishedResult = null!;

    constructor(props: {
        orderId: Order["id"];
        orderItemId: IOrderItem["id"];
    }) {
        this.orderId = props.orderId;
        this.orderItemId = props.orderItemId;
    }

    public orderId: Order["id"];
    public orderItemId: IOrderItem["id"];
}
