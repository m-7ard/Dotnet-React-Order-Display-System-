import { err, ok } from "neverthrow";
import IOrderDataAccess from "../../../interfaces/dataAccess/IOrderDataAccess";
import { ICommandHandler } from "../../ICommandHandler";
import MarkOrderFinishedCommand from "./MarkOrderFinishedCommand";
import MarkOrderFinishedResult from "./MarkOrderFinishedResult";

export default class MarkOrderFinishedHandler
    implements ICommandHandler<MarkOrderFinishedCommand, MarkOrderFinishedResult>
{
    private _orderDataAccess: IOrderDataAccess;

    constructor(props: { orderDataAccess: IOrderDataAccess }) {
        this._orderDataAccess = props.orderDataAccess;
    }

    async handle(request: MarkOrderFinishedCommand): Promise<MarkOrderFinishedResult> {
        try {
            const result = await this._orderDataAccess.markOrderFinished({
                orderId: request.orderId,
            });
            console.log(result.isOk())

            if (result.isErr()) {
                return err({ type: "API", data: result.error });
            }

            return ok({ order: result.value });
        } catch (error: unknown) {
            return err({ type: "Exception", data: error });
        }
    }
}
