import { err, ok } from "neverthrow";
import IOrderDataAccess from "../../../interfaces/dataAccess/IOrderDataAccess";
import { ICommandHandler } from "../../ICommandHandler";
import ReadOrderCommand from "./ReadOrderCommand";
import IReadOrderResult from "./IReadOrderResult";
import IOrderStateManager from "../../../interfaces/stateManagers/IOrderStateManager";

export default class ReadOrderHandler implements ICommandHandler<ReadOrderCommand, IReadOrderResult> {
    private _orderDataAccess: IOrderDataAccess;
    private _orderStateManager: IOrderStateManager;

    constructor(props: { orderDataAccess: IOrderDataAccess; orderStateManager: IOrderStateManager }) {
        this._orderDataAccess = props.orderDataAccess;
        this._orderStateManager = props.orderStateManager;
    }

    async handle(request: ReadOrderCommand): Promise<IReadOrderResult> {
        try {
            const cachedOrder = this._orderStateManager.getOrder(request.orderId);
            if (cachedOrder != null) {
                return ok({ order: cachedOrder });
            }

            const result = await this._orderDataAccess.readOrder({
                id: request.orderId,
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
