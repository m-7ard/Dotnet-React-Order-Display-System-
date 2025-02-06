import ProductHistoriesPage from "./ProductHistories.Page";
import useRouterLoaderData from "../../hooks/useRouterLoaderData";

export default function ProductHistoriesController() {
    const { productHistories } = useRouterLoaderData((keys) => keys.LIST_PRODUCT_HISTORIES);
    return <ProductHistoriesPage productHistories={productHistories} />;
}
