import IOrder from "../../../../domain/models/IOrder";
import ICommand from "../../ICommand";
import IReadOrderResult from "./IReadOrderResult";

export default class ReadOrderCommand implements ICommand<IReadOrderResult> {
    __returnType: IReadOrderResult = null!;

    constructor(props: {
        orderId: IOrder["id"];
    }) {
        this.orderId = props.orderId;
    }

    public orderId: IOrder["id"];
}
