import { err, ok } from "neverthrow";
import IOrderDataAccess from "../../../interfaces/dataAccess/IOrderDataAccess";
import { ICommandHandler } from "../../ICommandHandler";
import MarkOrderItemFinishedCommand from "./MarkOrderItemFinishedCommand";
import MarkOrderItemFinishedResult from "./MarkOrderItemFinishedResult";

export default class MarkOrderItemFinishedHandler
    implements ICommandHandler<MarkOrderItemFinishedCommand, MarkOrderItemFinishedResult>
{
    private _orderDataAccess: IOrderDataAccess;

    constructor(props: { orderDataAccess: IOrderDataAccess }) {
        this._orderDataAccess = props.orderDataAccess;
    }

    async handle(request: MarkOrderItemFinishedCommand): Promise<MarkOrderItemFinishedResult> {
        try {
            const result = await this._orderDataAccess.markOrderItemFinished({
                orderId: request.orderId,
                orderItemId: request.orderItemId,
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
