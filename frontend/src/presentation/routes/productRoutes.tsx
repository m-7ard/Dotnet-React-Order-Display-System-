import { createRoute, redirect } from "@tanstack/react-router";
import rootRoute from "./_rootRoute";
import { Value } from "@sinclair/typebox/value";
import { Type } from "@sinclair/typebox";
import UpdateProductController from "../Application/Products/Update/UpdateProduct.Controller";
import routeData from "./_routeData";
import { productDataAccess } from "../deps/dataAccess";
import ProductsController from "../Application/Products/Products.Controller";
import CreateProductController from "../Application/Products/Create/CreateProduct.Controller";
import IReadProductResponseDTO from "../../application/contracts/products/read/IReadProductResponseDTO";
import productMapper from "../../infrastructure/mappers/productMapper";
import IListProductsResponseDTO from "../../application/contracts/products/list/IListProductsResponseDTO";
import parseListProductsCommandParameters from "../../infrastructure/parsers/parseListProductsCommandParameters";

const baseProductsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routeData.listProducts.pattern,
    loaderDeps: ({ search }: { search: Record<string, string> }) => search,
    loader: async ({ deps }) => {
        const params = parseListProductsCommandParameters(deps);
        const response = await productDataAccess.listProducts(params);
        if (!response.ok) {
            throw redirect({ to: "/" });
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
        const id = parseInt(params.id);
        if (!Value.Check(Type.Integer(), id)) {
            throw redirect({ to: "/products" });
        }

        const response = await productDataAccess.readProduct({ id: id });

        if (!response.ok) {
            throw redirect({ to: "/products" });
        }

        const dto: IReadProductResponseDTO = await response.json();
        const product = productMapper.apiToDomain(dto.product);

        return product;
    },
});

export default [baseProductsRoute, createProductRoute, updateProductRoute];
