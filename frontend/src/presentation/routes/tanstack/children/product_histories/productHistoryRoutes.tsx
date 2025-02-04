import { createRoute } from "@tanstack/react-router";
import rootRoute from "../../rootRoute";
import { productHistoryDataAccess } from "../../../../deps/dataAccess";
import IListProductHistoriesResponseDTO from "../../../../../infrastructure/contracts/productHistories/list/IListProductHistoriesResponseDTO";
import productHistoryMapper from "../../../../../infrastructure/mappers/productHistoryMapper";
import ProductHistoriesController from "../../../../Application/ProductHistories/ProductHistories.Controller";
import parseListProductHistoriesRequestDTO from "../../../../../infrastructure/parsers/parseListProductHistoriesRequestDTO";
import TanstackRouterUtils from "../../../../utils/TanstackRouterUtils";
import { ListProductHistoriesLoaderData, tanstackConfigs } from "../../../Route";

const listProductHistoriesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.LIST_PRODUCT_HISTORIES.pattern,
    loaderDeps: ({ search }: { search: Record<string, string> }) => search,
    loader: async ({ deps }): Promise<ListProductHistoriesLoaderData> => {
        const params = parseListProductHistoriesRequestDTO(deps);

        const response = await TanstackRouterUtils.handleRequest(productHistoryDataAccess.listProductHistories(params));
        if (!response.ok) {
            await TanstackRouterUtils.handleInvalidResponse(response);
        }

        const dto: IListProductHistoriesResponseDTO = await response.json();
        return {
            productHistories: dto.productHistories.map(productHistoryMapper.apiToDomain),
        };
    },
    component: ProductHistoriesController,
});

export default [listProductHistoriesRoute];
