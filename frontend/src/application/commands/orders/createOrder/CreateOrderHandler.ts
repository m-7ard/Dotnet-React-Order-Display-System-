import { err, ok } from "neverthrow";
import IOrderDataAccess from "../../../interfaces/dataAccess/IOrderDataAccess";
import { ICommandHandler } from "../../ICommandHandler";
import CreateOrderCommand from "./CreateOrderCommand";
import ICreateOrderResult from "./ICreateOrderResult";


export default class CreateOrderHandler implements ICommandHandler<CreateOrderCommand, ICreateOrderResult> {
    private _orderDataAccess: IOrderDataAccess;

    constructor(props: { orderDataAccess: IOrderDataAccess }) {
        this._orderDataAccess = props.orderDataAccess;
    }

    async handle(request: CreateOrderCommand): Promise<ICreateOrderResult> {
        try {
            const result = await this._orderDataAccess.createOrder({
                orderItemData: request.orderItemData
            });

            if (result.isErr()) {
                return err({ type: "API", data: result.error });
            }

            return ok({ order: result.value });
        } catch (error: unknown) {
            return err({ type: "Exception", data: error });
        }
    }
}
