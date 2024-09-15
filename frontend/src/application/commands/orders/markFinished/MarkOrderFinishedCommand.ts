import Order from "../../../../domain/models/Order";
import ICommand from "../../ICommand";
import MarkOrderFinishedResult from "./MarkOrderFinishedResult";

export default class MarkOrderFinishedCommand implements ICommand<MarkOrderFinishedResult> {
    __returnType: MarkOrderFinishedResult = null!;

    constructor(props: {
        orderId: Order["id"];
    }) {
        this.orderId = props.orderId;
    }

    public orderId: Order["id"];
}
