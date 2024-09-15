import { err, ok } from "neverthrow";
import { ICommandHandler } from "../../ICommandHandler";
import ReadProductCommand from "./ReadProductCommand";
import IReadProductResult from "./IReadOrderResult";
import IProductStateManager from "../../../interfaces/stateManagers/IProductStateManager";
import IProductDataAccess from "../../../interfaces/dataAccess/IProductAccess";

export default class ReadProductHandler implements ICommandHandler<ReadProductCommand, IReadProductResult> {
    private _productDataAccess: IProductDataAccess;
    private _productStateManager: IProductStateManager;

    constructor(props: { productDataAccess: IProductDataAccess; productStateManager: IProductStateManager }) {
        this._productDataAccess = props.productDataAccess;
        this._productStateManager = props.productStateManager;
    }

    async handle(request: ReadProductCommand): Promise<IReadProductResult> {
        try {
            const cachedProduct = this._productStateManager.getProduct(request.productId);
            if (cachedProduct != null) {
                return ok({ product: cachedProduct });
            }

            const result = await this._productDataAccess.readProduct({
                id: request.productId,
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
