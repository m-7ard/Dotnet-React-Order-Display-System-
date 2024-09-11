import IProductDataAccess from "../../../interfaces/dataAccess/IProductAccess";
import { ICommandHandler } from "../../ICommandHandler";
import { err, ok } from "neverthrow";
import IListProductsCommand from "./ListProductsCommand";
import IListProductsResult from "./IListProductsResult";

export default class ListProductsCommandHandler implements ICommandHandler<IListProductsCommand, IListProductsResult> {
    private _productDataAccess: IProductDataAccess;

    constructor(props: { productDataAccess: IProductDataAccess }) {
        this._productDataAccess = props.productDataAccess;
    }

    async handle(request: IListProductsCommand): Promise<IListProductsResult> {
        try {
            const result = await this._productDataAccess.listProducts({
                name: request.name,
                minPrice: request.minPrice,
                maxPrice: request.maxPrice,
                description: request.description,
                createdBefore: request.createdBefore,
                createdAfter: request.createdAfter,
            });

            if (result.isErr()) {
                return err({ type: "API", data: result.error });
            }

            return ok({ products: result.value });
        } catch (error: unknown) {
            return err({ type: "Exception", data: error });
        }
    }
}
