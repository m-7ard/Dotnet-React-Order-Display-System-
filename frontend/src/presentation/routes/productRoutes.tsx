import { createRoute } from "@tanstack/react-router";
import rootRoute from "./_rootRoute";
import ProductsPage from "../Application/Products/ProductsPage";
import CreateProductPage from "../Application/Products/Create/CreateProductPage";
import ListProductsCommand from "../../application/commands/products/listProducts/ListProductsCommand";
import commandDispatcher from "../deps/commandDispatcher";
import UnknownError from "../../application/errors/UnkownError";
import { Value } from "@sinclair/typebox/value";
import { Type } from "@sinclair/typebox";
import IProduct from "../../domain/models/IProduct";
import ILoaderResult from "../../application/interfaces/ILoaderResult";
import ReadProductCommand from "../../application/commands/products/readProduct/ReadProductCommand";
import UpdateProductRoute from "../Application/Products/Update/UpdateProductRoute";
import parseListProductsCommandParameters from "../../application/commands/products/listProducts/parseListProductsCommandParameters";
import routeData from "./_routeData";
import IListProductsRequestDTO from "../../application/contracts/products/list/IListProductsRequestDTO";

const baseProductsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.listProducts.pattern,
    loaderDeps: ({
        search,
    }: {
        search: Partial<Record<keyof IListProductsRequestDTO, string>>
    }) => search,
    loader: async ({ deps }) => {
        const params = parseListProductsCommandParameters(deps);
        const command = new ListProductsCommand(params);
        const result = await commandDispatcher.dispatch(command);

        return {
            productsResult: result,
        };
    },
    component: ProductsPage,
});

const createProductRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.createProduct.pattern,
    component: CreateProductPage,
});

const updateProductRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.updateProduct.pattern,
    component: UpdateProductRoute,
    loader: async ({ params }): Promise<ILoaderResult<IProduct, unknown>> => {
        const id = parseInt(params.id);
        if (!Value.Check(Type.Integer(), id)) {
            return {
                ok: false,
                data: new Error(`Product id "${params.id}" is not a valid id.`),
            };
        }

        const command = new ReadProductCommand({ productId: id });
        const result = await commandDispatcher.dispatch(command);

        if (result.isOk()) {
            return {
                ok: true,
                data: result.value.product,
            };
        }

        const { type, data } = result.error;

        return {
            ok: false,
            data: type === "Exception" ? data : new UnknownError({}),
        };
    },
});

export default [baseProductsRoute, createProductRoute, updateProductRoute];
