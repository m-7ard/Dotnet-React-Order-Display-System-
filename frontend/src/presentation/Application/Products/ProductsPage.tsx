import { useQuery } from "@tanstack/react-query";
import { Link, useLoaderData } from "@tanstack/react-router";
import IProduct from "../../../domain/models/IProduct";
import MixinButton from "../../components/MixinButton";
import { useApplicationExceptionContext } from "../../contexts/ApplicationExceptionHandlerContext";
import { useEffect } from "react";
import CoverImage from "../../components/CoverImage";

export default function ProductsPage() {
    const { productsResult } = useLoaderData({ from: "/products" });
    const { dispatchException } = useApplicationExceptionContext();
    const products = productsResult.isOk() ? productsResult.value.products : [];

    useEffect(() => {
        if (productsResult.isErr() && productsResult.error.type === "Exception") {
            dispatchException(productsResult.error.data);
        }
    }, [dispatchException, productsResult]);

    return (
        <div className="mixin-page-like mixin-page-base">
            <div className="text-2xl text-sky-600 font-medium">Products</div>
            <hr className="h-0 w-full border-bottom border-dashed border-gray-800"></hr>
            <div className="p-1 flex flex-col gap-2 bg-gray-200 border border-gray-400">
                <div className="flex flex-row gap-2">
                    <Link
                        to="/products/create"
                        className="mixin-button-like mixin-button-sm theme-button-generic-white"
                    >
                        Create
                    </Link>
                    <div className="mixin-button-like mixin-button-sm theme-button-generic-white">Filter</div>
                </div>
            </div>
            {products.map((product) => (
                <Product product={product} key={product.id} />
            ))}
        </div>
    );
}

function Product(props: { product: IProduct }) {
    const { product } = props;

    return (
        <div className="p-1 flex flex-col gap-1 bg-gray-200 border border-gray-400">
            <section className="grid grid-cols-2 h-32 w-full gap-1">
                <CoverImage
                    className="row-span-1 col-span-1 border border-gray-400"
                    src={`${import.meta.env.VITE_API_URL}/Media/${product.images[0]?.fileName}`}
                />
                <div className="row-span-1 col-span-1 gap-1 grid grid-cols-2 grid-rows-2">
                    {Array.from({ length: 4 }, (_, i) => i + 1).map((i) => (
                        <CoverImage
                            className="row-span-1 col-span-1 relative border border-gray-400"
                            src={
                                product.images[i] == null
                                    ? ""
                                    : `${import.meta.env.VITE_API_URL}/Media/${product.images[i]?.fileName}`
                            }
                        />
                    ))}
                </div>
            </section>
            <main className="flex flex-col gap-1">
                {[
                    { label: "Name", value: product.name },
                    { label: "Price", value: product.price },
                ].map(({ label, value }) => (
                    <div className="flex flex-row border border-gray-400 text-sm" key={label}>
                        <div className="px-2 bg-gray-300 text-gray-900">{label}</div>
                        <div className="px-2 border-l border-gray-400 flex grow justify-end bg-gray-100">{value}</div>
                    </div>
                ))}
            </main>
            <footer className="flex flex-row gap-1 flex-wrap">
                <MixinButton
                    className="grow"
                    type="button"
                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                >
                    Edit
                </MixinButton>
                <MixinButton
                    className="grow"
                    type="button"
                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                >
                    Delete
                </MixinButton>
                <MixinButton
                    className="grow"
                    type="button"
                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                >
                    See History
                </MixinButton>
            </footer>
            <footer className="flex flex-row gap-1 flex-wrap">
                <MixinButton
                    className="grow"
                    type="button"
                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                >
                    See Orders
                </MixinButton>
            </footer>
        </div>
    );
}
