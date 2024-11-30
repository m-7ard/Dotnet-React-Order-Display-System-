import { useLoaderData } from "@tanstack/react-router";
import ProductHistoriesPage from "./ProductHistories.Page";

export default function ProductHistoriesController() {
    const productHistory = useLoaderData({ from: "/product_histories" });
    return <ProductHistoriesPage productHistories={productHistory} />;
}
