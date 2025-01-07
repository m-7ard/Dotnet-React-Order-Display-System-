import { createRoute } from "@tanstack/react-router";
import rootRoute from "./_rootRoute";
import UpdateProductController from "../Application/Products/Update/UpdateProduct.Controller";
import routeData from "./_routeData";
import { productDataAccess } from "../deps/dataAccess";
import ProductsController from "../Application/Products/Products.Controller";
import CreateProductController from "../Application/Products/Create/CreateProduct.Controller";
import IReadProductResponseDTO from "../../infrastructure/contracts/products/read/IReadProductResponseDTO";
import productMapper from "../../infrastructure/mappers/productMapper";
import IListProductsResponseDTO from "../../infrastructure/contracts/products/list/IListProductsResponseDTO";
import parseListProductsRequestDTO from "../../infrastructure/parsers/parseListProductsRequestDTO";
import TanstackRouterUtils from "../utils/TanstackRouterUtils";

const baseProductsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.listProducts.pattern,
    loaderDeps: ({ search }: { search: Record<string, string> }) => search,
    loader: async ({ deps }) => {
        const params = parseListProductsRequestDTO(deps);
        
        const response = await TanstackRouterUtils.handleRequest(productDataAccess.listProducts(params));
        if (!response.ok) {
            await TanstackRouterUtils.handleInvalidResponse(response);
        }

        const data: IListProductsResponseDTO = await response.json();
        return data.products.map(productMapper.apiToDomain);
    },
    component: ProductsController,
});

const createProductRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.createProduct.pattern,
    component: CreateProductController,
});

const updateProductRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.updateProduct.pattern,
    component: UpdateProductController,
    loader: async ({ params }) => {
        const id = params.id;
        const response = await TanstackRouterUtils.handleRequest(productDataAccess.readProduct({ id: id }));
        if (!response.ok) {
            await TanstackRouterUtils.handleInvalidResponse(response);
        }

    const dto: IReadProductResponseDTO = await response.json();
        const product = productMapper.apiToDomain(dto.product);

        return product;
    },
});

export default [baseProductsRoute, createProductRoute, updateProductRoute];
