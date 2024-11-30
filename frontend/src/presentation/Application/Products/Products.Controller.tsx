import { useLoaderData } from "@tanstack/react-router";
import ProductsPage from "./Products.Page";

export default function ProductsController() {
    const products = useLoaderData({ from: "/products" });

    return <ProductsPage products={products} />;
}
