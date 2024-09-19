import { err, ok } from "neverthrow";
import { ICommandHandler } from "../../ICommandHandler";
import DeleteProductCommand from "./DeleteProductCommand";
import IDeleteProductResult from "./IDeleteProductResult";
import IProductDataAccess from "../../../interfaces/dataAccess/IProductDataAccess";

export default class DeleteProductHandler implements ICommandHandler<DeleteProductCommand, IDeleteProductResult> {
    private _productDataAccess: IProductDataAccess;

    constructor(props: { productDataAccess: IProductDataAccess; }) {
        this._productDataAccess = props.productDataAccess;
    }

    async handle(request: DeleteProductCommand): Promise<IDeleteProductResult> {
        try {
            const result = await this._productDataAccess.deleteProduct({
                id: request.id,
            });

            if (result.isErr()) {
                return err({ type: "API", data: result.error });
            }

            return ok({ product: result.value });
        } catch (error: unknown) {
            return err({ type: "Exception", data: error });
        }
    }
}
