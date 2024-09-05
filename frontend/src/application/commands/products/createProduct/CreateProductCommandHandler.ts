import ICreateProductResult from "./ICreateProductResult";
import IProductDataAccess from "../../../interfaces/dataAccess/IProductAccess";
import { ICommandHandler } from "../../ICommandHandler";
import { err, ok } from "neverthrow";
import { QueryClient } from "@tanstack/react-query";
import IProduct from "../../../../domain/models/IProduct";
import CreateProductCommand from "./CreateProductCommand";

export default class CreateProductCommandHandler
    implements ICommandHandler<CreateProductCommand, ICreateProductResult>
{
    private _queryClient: QueryClient;
    private _productDataAccess: IProductDataAccess;

    constructor(props: { queryClient: QueryClient; productDataAccess: IProductDataAccess }) {
        this._queryClient = props.queryClient;
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

            this._queryClient.setQueryData<IProduct[]>(["products"], (prev) => [...(prev ?? []), result.value.product]);
            return ok({ product: result.value.product });
        } catch (error: unknown) {
            return err({ type: "Exception", data: error });
        }
    }
}
