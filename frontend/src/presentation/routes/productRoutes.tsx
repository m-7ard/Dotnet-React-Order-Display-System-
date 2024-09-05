import { createRoute } from "@tanstack/react-router";
import rootRoute from "./_rootRoute";
import ProductsPage from "../Application/Products/ProductsPage";
import commandDispatcher from "../deps/commandDispatcher";
import ListProductsCommand from "../../application/commands/products/listProducts/ListProductsCommand";

const baseProdutsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/products",
    staleTime: 120,
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
            products: result.isErr() ? null : result.value.products
        }
    },
    component: ProductsPage,
});

export default [
    baseProdutsRoute
];