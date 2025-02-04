import ProductsPage from "./Products.Page";
import useRouterLoaderData from "../../hooks/useRouterLoaderData";

export default function ProductsController() {
    const { products } = useRouterLoaderData((keys) => keys.LIST_PRODUCTS);

    return <ProductsPage products={products} />;
}
