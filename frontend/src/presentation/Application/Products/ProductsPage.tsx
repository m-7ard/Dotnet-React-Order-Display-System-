import { useQuery } from "@tanstack/react-query";
import { Link, useLoaderData } from "@tanstack/react-router";
import IProduct from "../../../domain/models/IProduct";
import MixinButton from "../../components/Resuables/MixinButton";
import { useApplicationExceptionContext } from "../../contexts/ApplicationExceptionHandlerContext";
import { useEffect } from "react";
import CoverImage from "../../components/Resuables/CoverImage";

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
            <header className="text-2xl text-gray-900 font-bold">Products</header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <div className="flex flex-row gap-2">
                <Link to="/products/create" className="basis-1/2">
                    <MixinButton
                        className="justify-center w-full rounded shadow"
                        options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                    >
                        Create
                    </MixinButton>
                </Link>
                <MixinButton
                    className="justify-center w-full rounded shadow basis-1/2"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                >
                    Filter
                </MixinButton>
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
        <div className="bg-white divide-y divide-gray-300 rounded shadow border-gray-300 border">
            <section className="grid grid-cols-2 h-32 w-full gap-1 p-2 px-4">
                <CoverImage
                    className="row-span-1 col-span-1 border border-gray-400 rounded shadow overflow-hidden"
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
            <main className="flex flex-col gap-1 p-2 px-4">
                <div className="font-bold text-sm">{product.name}</div>
                <div className="p-0.5 px-2 bg-gray-900 text-white font-bold rounded shadow w-fit text-sm">
                    ${product.price}
                </div>
                <div className="flex flex-row gap-2 items-center text-xs ">
                    <div>
                        Date Created:
                    </div>
                    <div>
                        {product.dateCreated.toLocaleDateString("en-us")}
                    </div>
                </div>
            </main>
            <footer className="flex flex-row gap-2 p-2 px-4">
                <MixinButton
                    className="grow justify-center rounded shadow"
                    type="button"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                >
                    See Orders
                </MixinButton>
                <MixinButton
                    className="grow justify-center rounded shadow"
                    type="button"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                >
                    ...
                </MixinButton>
            </footer>
        </div>
    );
}
