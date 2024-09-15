import ICreateProductResult from "./ICreateProductResult";
import IProductDataAccess from "../../../interfaces/dataAccess/IProductAccess";
import { ICommandHandler } from "../../ICommandHandler";
import { err, ok } from "neverthrow";
import CreateProductCommand from "./CreateProductCommand";

export default class CreateProductHandler
    implements ICommandHandler<CreateProductCommand, ICreateProductResult>
{
    private _productDataAccess: IProductDataAccess;

    constructor(props: { productDataAccess: IProductDataAccess }) {
        this._productDataAccess = props.productDataAccess;
    }

    async handle(request: CreateProductCommand): Promise<ICreateProductResult> {
        try {
            const result = await this._productDataAccess.createProduct({
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
