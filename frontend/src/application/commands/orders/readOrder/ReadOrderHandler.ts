import { err, ok } from "neverthrow";
import IOrderDataAccess from "../../../interfaces/dataAccess/IOrderDataAccess";
import { ICommandHandler } from "../../ICommandHandler";
import ReadOrderCommand from "./ReadOrderCommand";
import IReadOrderResult from "./IReadOrderResult";


export default class ReadOrderHandler implements ICommandHandler<ReadOrderCommand, IReadOrderResult> {
    private _orderDataAccess: IOrderDataAccess;

    constructor(props: { orderDataAccess: IOrderDataAccess }) {
        this._orderDataAccess = props.orderDataAccess;
    }

    async handle(request: ReadOrderCommand): Promise<IReadOrderResult> {
        try {
            const result = await this._orderDataAccess.readOrder({
                id: request.orderId
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
