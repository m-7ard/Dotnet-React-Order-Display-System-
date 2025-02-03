import ProductsPage from "./Products.Page";
import useRouterLoaderData from "../../hooks/useRouterLoaderData";
import { IListProductsLoaderData } from "../../routes/tanstack/children/products/productRoutes";

export default function ProductsController() {
    const { products } = useRouterLoaderData<IListProductsLoaderData>((keys) => keys.LIST_PRODUCTS);

    return <ProductsPage products={products} />;
}
