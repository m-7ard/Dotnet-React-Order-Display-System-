import Order from "../../../../domain/models/Order";
import ICommand from "../../ICommand";
import IReadOrderResult from "./IReadOrderResult";

export default class ReadOrderCommand implements ICommand<IReadOrderResult> {
    __returnType: IReadOrderResult = null!;

    constructor(props: {
        orderId: Order["id"];
    }) {
        this.orderId = props.orderId;
    }

    public orderId: Order["id"];
}
