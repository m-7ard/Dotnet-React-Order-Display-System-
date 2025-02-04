import { createRoute } from "@tanstack/react-router";
import rootRoute from "../../rootRoute";
import UpdateProductController from "../../../../Application/Products/Update/UpdateProduct.Controller";
import { productDataAccess } from "../../../../deps/dataAccess";
import ProductsController from "../../../../Application/Products/Products.Controller";
import CreateProductController from "../../../../Application/Products/Create/CreateProduct.Controller";
import IReadProductResponseDTO from "../../../../../infrastructure/contracts/products/read/IReadProductResponseDTO";
import productMapper from "../../../../../infrastructure/mappers/productMapper";
import IListProductsResponseDTO from "../../../../../infrastructure/contracts/products/list/IListProductsResponseDTO";
import parseListProductsRequestDTO from "../../../../../infrastructure/parsers/parseListProductsRequestDTO";
import TanstackRouterUtils from "../../../../utils/TanstackRouterUtils";
import { IUpdateProductParams, ListProductsLoaderData, tanstackConfigs, UpdateProductLoaderData } from "../../../Route";

const listProductsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.LIST_PRODUCTS.pattern,
    loaderDeps: ({ search }: { search: Record<string, string> }) => search,
    loader: async ({ deps }): Promise<ListProductsLoaderData> => {
        const params = parseListProductsRequestDTO(deps);

        const response = await TanstackRouterUtils.handleRequest(productDataAccess.listProducts(params));
        if (!response.ok) {
            await TanstackRouterUtils.handleInvalidResponse(response);
        }

        const data: IListProductsResponseDTO = await response.json();
        return {
            products: data.products.map(productMapper.apiToDomain),
        };
    },
    component: ProductsController,
});

const createProductRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.CREATE_PRODUCT.pattern,
    component: CreateProductController,
});

const updateProductRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: tanstackConfigs.UPDATE_PRODUCT.pattern,
    component: UpdateProductController,
    loader: async ({ params }: { params: IUpdateProductParams }): Promise<UpdateProductLoaderData> => {
        const id = params.id;
        const response = await TanstackRouterUtils.handleRequest(productDataAccess.readProduct({ id: id }));
        if (!response.ok) {
            await TanstackRouterUtils.handleInvalidResponse(response);
        }

        const dto: IReadProductResponseDTO = await response.json();
        const product = productMapper.apiToDomain(dto.product);

        return {
            product: product,
        };
    },
});

export default [listProductsRoute, createProductRoute, updateProductRoute];
