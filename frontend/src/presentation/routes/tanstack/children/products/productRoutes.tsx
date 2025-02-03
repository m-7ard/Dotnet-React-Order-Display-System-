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
import IProduct from "../../../../../domain/models/IProduct";
import routeConfig from "../../routeConfig";

export interface IListProductsLoaderData {
    products: IProduct[];
}

const listProductsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeConfig.LIST_PRODUCTS.path,
    loaderDeps: ({ search }: { search: Record<string, string> }) => search,
    loader: async ({ deps }): Promise<IListProductsLoaderData> => {
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
    path: routeConfig.CREATE_PRODUCT.path,
    component: CreateProductController,
});

export interface IUpdateProductLoaderData {
    product: IProduct;
}

const updateProductRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeConfig.UPDATE_PRODUCT.path,
    component: UpdateProductController,
    loader: async ({ params }): Promise<IUpdateProductLoaderData> => {
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
