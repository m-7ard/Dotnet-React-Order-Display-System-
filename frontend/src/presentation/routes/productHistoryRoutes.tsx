import { createRoute } from "@tanstack/react-router";
import rootRoute from "./_rootRoute";
import commandDispatcher from "../deps/commandDispatcher";
import parseListProductHistoriesCommandParameters from "../../application/commands/productHistories/list/parseListProductHistoriesCommandParameters";
import ListProductHistoriesCommand from "../../application/commands/productHistories/list/ListProductHistoriesCommand";
import ProductHistoriesPage from "../Application/ProductHistories/ProductHistoriesPage";
import routeData from "./_routeData";

const listProductHistoriesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.listProductHistories.pattern,
    loaderDeps: ({
        search,
    }: {
        search: {
            minPrice?: string;
            maxPrice?: string;
            name?: string;
            validTo?: string;
            validFrom?: string;
            description?: string;
            productId?: string;
        }
    }) => search,
    loader: async ({ deps }) => {
        const params = parseListProductHistoriesCommandParameters({
            maxPrice: deps.maxPrice,
            minPrice: deps.minPrice,
            name: deps.name,
            validTo: deps.validTo,
            validFrom: deps.validFrom,
            description: deps.description,
            productId: deps.productId,
        });
        const command = new ListProductHistoriesCommand(params);
        const result = await commandDispatcher.dispatch(command);

        return {
            result: result,
        };
    },
    component: ProductHistoriesPage,
})

export default [
    listProductHistoriesRoute
]