import { ICommandHandler } from "../../ICommandHandler";
import { err, ok } from "neverthrow";
import IListProductsCommand from "./ListOrdersCommand";
import IListProductsResult from "./IListOrdersResult";
import IOrderDataAccess from "../../../interfaces/dataAccess/IOrderDataAccess";
import IListOrdersResult from "./IListOrdersResult";
import ListOrdersCommand from "./ListOrdersCommand";
import OrderStatus from "../../../../domain/valueObjects/Order/OrderStatus";

export default class ListOrdersHandler implements ICommandHandler<IListProductsCommand, IListProductsResult> {
    private _orderDataAccess: IOrderDataAccess;

    constructor(props: { orderDataAccess: IOrderDataAccess }) {
        this._orderDataAccess = props.orderDataAccess;
    }

    async handle(request: ListOrdersCommand): Promise<IListOrdersResult> {
        try {
            if (request.status != null && OrderStatus.isValid(request.status)) {
                request.status = null;
            }

            const result = await this._orderDataAccess.listOrders({
                id: request.id,
                createdAfter: request.createdAfter,
                createdBefore: request.createdBefore,
                maxTotal: request.maxTotal,
                minTotal: request.minTotal,
                status: request.status,
                productId: request.productId,
            });

            if (result.isErr()) {
                return err({ type: "API", data: result.error });
            }

            return ok({ orders: result.value });
        } catch (error: unknown) {
            return err({ type: "Exception", data: error });
        }
    }
}
