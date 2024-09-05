import IProductDataAccess from "../../../interfaces/dataAccess/IProductAccess";
import { ICommandHandler } from "../../ICommandHandler";
import { err, ok } from "neverthrow";
import IListProductsCommand from "./UploadProductImagesCommand";
import IUploadProductImagesResult from "./IUploadProductImagesResult";

export default class UploadProductImagesCommandHandler implements ICommandHandler<IListProductsCommand, IUploadProductImagesResult> {
    readonly _productDataAccess: IProductDataAccess;

    constructor(props: {
        productDataAccess: IProductDataAccess
    }) {
        this._productDataAccess = props.productDataAccess;
    }

    async handle(request: IListProductsCommand): Promise<IUploadProductImagesResult> {
        try {
            const result = await this._productDataAccess.({
              
            });

            if (result.isErr()) {
                return err({ type: "API", data: result.error });
            }

            return ok({ products: result.value.products });
        } catch (error: unknown) {
            return err({ type: "Exception", data: error });
        }
    }
}
