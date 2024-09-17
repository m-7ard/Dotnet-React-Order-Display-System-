import IUpdateProductResult from "./IUpdateProductResult";
import IProductDataAccess from "../../../interfaces/dataAccess/IProductAccess";
import { ICommandHandler } from "../../ICommandHandler";
import { err, ok } from "neverthrow";
import UpdateProductCommand from "./UpdateProductCommand";

export default class UpdateProductHandler implements ICommandHandler<UpdateProductCommand, IUpdateProductResult> {
    private _productDataAccess: IProductDataAccess;

    constructor(props: { productDataAccess: IProductDataAccess }) {
        this._productDataAccess = props.productDataAccess;
    }

    async handle(request: UpdateProductCommand): Promise<IUpdateProductResult> {
        try {
            const result = await this._productDataAccess.updateProduct({
                id: request.id,
                name: request.name,
                price: request.price,
                description: request.description,
                images: request.images,
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
