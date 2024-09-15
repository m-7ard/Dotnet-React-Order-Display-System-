import { QueryClient } from "@tanstack/react-query";
import IProductStateManager from "../../application/interfaces/stateManagers/IProductStateManager";
import IProduct from "../../domain/models/IProduct";

export default class ProductStateManager implements IProductStateManager {
    private readonly _queryClient: QueryClient;
    
    constructor(props: {
        queryClient: QueryClient
    }) {
        this._queryClient = props.queryClient;
    }

    setProduct(product: IProduct): void {
        this._queryClient.setQueryData(["product", product.id], product);
    }

    getProduct(productId: IProduct["id"]): IProduct | null {
        return this._queryClient.getQueryData(["product", productId]) ?? null;
    }
}