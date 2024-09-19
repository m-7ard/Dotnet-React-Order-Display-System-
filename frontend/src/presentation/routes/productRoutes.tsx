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

const baseProductsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/products",
    loaderDeps: ({
        search,
    }: {
        search: {
            name?: string;
            minPrice?: number;
            maxPrice?: number;
            description?: string;
            createdBefore?: Date;
            createdAfter?: Date;
        };
    }) => search,
    loader: async ({ deps }) => {
        const command = new ListProductsCommand({
            name: deps.name ?? null,
            minPrice: deps.minPrice ?? null,
            maxPrice: deps.maxPrice ?? null,
            description: deps.description ?? null,
            createdBefore: deps.createdBefore ?? null,
            createdAfter: deps.createdAfter ?? null,
        });
        const result = await commandDispatcher.dispatch(command);
        
        return {
            productsResult: result
        }
    },
    component: ProductsPage,
});

const createProductRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/products/create",
    component: CreateProductPage
});

const updateProductRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/products/$id/update",
    component: UpdateProductRoute,
    loader: async ({
        params,
    }): Promise<ILoaderResult<IProduct, unknown>> => {
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

export default [
    baseProductsRoute,
    createProductRoute,
    updateProductRoute
];