import { createRoute } from "@tanstack/react-router";
import rootRoute from "./_rootRoute";
import ProductsPage from "../Application/Products/ProductsPage";
import CreateProductPage from "../Application/Products/Create/CreateProductPage";
import ListProductsCommand from "../../application/commands/products/listProducts/ListProductsCommand";
import commandDispatcher from "../deps/commandDispatcher";

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

export default [
    baseProductsRoute,
    createProductRoute
];