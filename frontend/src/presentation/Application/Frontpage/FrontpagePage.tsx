import { Link } from "@tanstack/react-router";
import Linkbox from "../../components/Resuables/LinkBox";
import MixinButton from "../../components/Resuables/MixinButton";

export default function FrontpagePage() {
    return (
        <div className="mixin-page-like mixin-page-base theme-page-generic-white">
            <header className="flex flex-row gap-2 items-center justify-between">
                <Linkbox parts={[]} />
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <section className="flex flex-col gap-2 items-center">
                <div className="flex flex-col gap-2 bg-gray-100 border-gray-900 border p-4 w-72">
                        <Link to={"/products"} className="w-full">
                            <MixinButton
                                options={{
                                    size: "mixin-button-base",
                                    theme: "theme-button-generic-white",
                                }}
                                className="flex flex-row justify-center w-full"
                            >
                                Products
                            </MixinButton>
                        </Link>
                        <Link to={"/orders"} className="w-full">
                            <MixinButton
                                options={{
                                    size: "mixin-button-base",
                                    theme: "theme-button-generic-white",
                                }}
                                className="flex flex-row justify-center w-full"
                            >
                                Orders
                            </MixinButton>
                        </Link>
                        <Link to={"/product_histories"} className="w-full">
                            <MixinButton
                                options={{
                                    size: "mixin-button-base",
                                    theme: "theme-button-generic-white",
                                }}
                                className="flex flex-row justify-center w-full"
                            >
                                Product Histories
                            </MixinButton>
                        </Link>
                </div>
            </section>
        </div>
    );
}
