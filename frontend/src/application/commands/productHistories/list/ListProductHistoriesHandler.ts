import IProductHistoryDataAccess from "../../../interfaces/dataAccess/IProductHistoryDataAccess";
import { ICommandHandler } from "../../ICommandHandler";
import { err, ok } from "neverthrow";
import ListProductHistoriesCommand from "./ListProductHistoriesCommand";
import IListProductHistoriesResult from "./IListProductHistoriesResult";

export default class ListProductHistoriesHandler implements ICommandHandler<ListProductHistoriesCommand, IListProductHistoriesResult> {
    private _productHistoryDataAccess: IProductHistoryDataAccess;

    constructor(props: { productHistoryDataAccess: IProductHistoryDataAccess }) {
        this._productHistoryDataAccess = props.productHistoryDataAccess;
    }

    async handle(request: ListProductHistoriesCommand): Promise<IListProductHistoriesResult> {
        try {
            const result = await this._productHistoryDataAccess.listProductHistories({
                name: request.name,
                minPrice: request.minPrice,
                maxPrice: request.maxPrice,
                description: request.description,
                validTo: request.validTo,
                validFrom: request.validFrom,
                productId: request.productId,
                orderBy: request.orderBy
            });

            if (result.isErr()) {
                return err({ type: "API", data: result.error });
            }

            return ok({ productHistories: result.value });
        } catch (error: unknown) {
            return err({ type: "Exception", data: error });
        }
    }
}
