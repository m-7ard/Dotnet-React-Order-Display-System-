import ICommand from "../../ICommand";
import ICreateOrderResult from "./ICreateOrderResult";

export default class CreateOrderCommand implements ICommand<ICreateOrderResult> {
    __returnType: ICreateOrderResult = null!;

    constructor(props: {
        orderItemData: {
            [UID: string]: {
                productId: number;
                quantity: number;
            };
        };
    }) {
        this.orderItemData = props.orderItemData;
    }

    public orderItemData: {
        [UID: string]: {
            productId: number;
            quantity: number;
        };
    };
}
