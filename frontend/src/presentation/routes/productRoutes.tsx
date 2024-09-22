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
import listProductsSchema from "../schemas/listProductsSchema";
import parseTypeboxSchemaOrNull from "../utils/parseTypeboxSchemaOrNull";

const baseProductsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/products",
    loaderDeps: ({
        search,
    }: {
        search: {
            id?: string;
            minPrice?: string;
            maxPrice?: string;
            name?: string;
            createdAfter?: string;
            createdBefore?: string;
            description?: string;
        }
    }) => search,
    loader: async ({ deps }) => {
        const command = new ListProductsCommand({
            id: parseTypeboxSchemaOrNull(listProductsSchema.properties.id, deps.id),
            minPrice: parseTypeboxSchemaOrNull(listProductsSchema.properties.minPrice, deps.minPrice),
            maxPrice: parseTypeboxSchemaOrNull(listProductsSchema.properties.maxPrice, deps.maxPrice),
            name: parseTypeboxSchemaOrNull(listProductsSchema.properties.name, deps.name),
            createdAfter: parseTypeboxSchemaOrNull(listProductsSchema.properties.createdAfter, deps.createdAfter),
            createdBefore: parseTypeboxSchemaOrNull(listProductsSchema.properties.createdBefore, deps.createdBefore),
            description: parseTypeboxSchemaOrNull(listProductsSchema.properties.description, deps.description),
        });
        const result = await commandDispatcher.dispatch(command);

        return {
            productsResult: result,
        };
    },
    component: ProductsPage,
});

const createProductRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/products/create",
    component: CreateProductPage,
});

const updateProductRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/products/$id/update",
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
