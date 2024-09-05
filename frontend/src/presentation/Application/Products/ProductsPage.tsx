import { useQuery } from "@tanstack/react-query";
import { Link, useLoaderData } from "@tanstack/react-router";
import IProduct from "../../../domain/models/IProduct";
import MixinButton from "../../components/MixinButton";

export default function ProductsPage() {
    const { products } = useLoaderData({ from: "/products" });
    const query = useQuery({ queryKey: ["products"], queryFn: async () => products });
    const queryData = query.data ?? [];

    return (
        <div className="mixin-page-like mixin-page-base">
            <div className="text-2xl text-sky-600 font-medium">Menu Items</div>
            <hr className="h-0 w-full border-bottom border-dashed border-gray-800"></hr>
            <div className="p-1 flex flex-col gap-2 bg-gray-200 border border-gray-400">
                <div className="flex flex-row gap-2">
                    <Link
                        to="/"
                        className="mixin-button-like mixin-button-sm theme-button-generic-white"
                    >
                        Create
                    </Link>
                    <div className="mixin-button-like mixin-button-sm theme-button-generic-white">Filter</div>
                </div>
            </div>
            {queryData.map((product) => (
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
                <div className="row-span-1 col-span-1 relative border border-gray-400">
                    <img
                        className="absolute w-full h-full object-cover sm:object-contain"
                        src={`http://localhost:5196/Media/${product.images[0]?.fileName}`}
                        alt={product.images[0]?.fileName}
                    ></img>
                </div>
                <div className="row-span-1 col-span-1 gap-1 grid grid-cols-2 grid-rows-2">
                    {Array.from({ length: 4 }, (_, i) => i + 1).map((i) => (
                        <div className="row-span-1 col-span-1 relative border border-gray-400">
                            {product.images[i] == null ? null : (
                                <img
                                    key={i}
                                    className="absolute w-full h-full object-cover sm:object-contain"
                                    src={`http://localhost:5196/Media/${product.images[i]?.fileName}`}
                                    alt={product.images[i]?.fileName}
                                ></img>
                            )}
                        </div>
                    ))}
                </div>
            </section>
            <main className="flex flex-col gap-1">
                {[
                    { label: "Name", value: product.name },
                    { label: "Price", value: product.price },
                ].map(({ label, value }) => (
                    <div className="flex flex-row border border-gray-400 text-sm">
                        <div className="px-2 bg-gray-300 text-gray-900">
                            {label}
                        </div>
                        <div className="px-2 border-l border-gray-400 flex grow justify-end bg-gray-100">
                            {value}
                        </div>
                    </div>
                ))}
            </main>
            <footer className="flex flex-row gap-1 flex-wrap">
                <MixinButton className="grow" type="button" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}>
                    Edit
                </MixinButton>
                <MixinButton className="grow" type="button" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}>
                    Delete
                </MixinButton>
                <MixinButton className="grow" type="button" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}>
                    See History
                </MixinButton>
            </footer>
            <footer className="flex flex-row gap-1 flex-wrap">
                <MixinButton className="grow" type="button" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}>
                    See Orders
                </MixinButton>
            </footer>
        </div>
    );
}
