import ProductHistoriesPage from "./ProductHistories.Page";
import useRouterLoaderData from "../../hooks/useRouterLoaderData";
import { ListProductHistoriesLoaderData } from "../../routes/tanstack/children/product_histories/productHistoryRoutes";

export default function ProductHistoriesController() {
    const { productHistories } = useRouterLoaderData<ListProductHistoriesLoaderData>((keys) => keys.LIST_PRODUCT_HISTORIES);
    return <ProductHistoriesPage productHistories={productHistories} />;
}
