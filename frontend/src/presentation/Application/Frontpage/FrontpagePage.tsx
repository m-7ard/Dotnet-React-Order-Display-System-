import { Link } from "@tanstack/react-router";
import Linkbox from "../../components/Resuables/LinkBox";
import CoverImage from "../../components/Resuables/CoverImage";
import MixinButton from "../../components/Resuables/MixinButton";

export default function FrontpagePage() {
    return (
        <div className="mixin-page-like mixin-page-base mx-auto">
            <header className="flex flex-row gap-2 items-center justify-between">
                <Linkbox parts={[]} />
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <ul className="mixin-page-content-like mixin-page-content-base sm:grid sm:grid-cols-2">
                <li className="p-4 bg-gray-50 border-gray-900 border flex flex-col gap-2 sm:max-w-full max-w-96 w-full mx-auto">
                    <div className="flex flex-row gap-2 items-center">
                        <CoverImage
                            className="h-20 w-20 border border-gray-900"
                            src={
                                new URL(
                                    "/src/presentation/images/_045d1801-1987-4ce3-abd9-1b8f56fcde24-removebg-preview.png",
                                    import.meta.url,
                                ).href
                            }
                        />
                        <div className="font-bold text-center mx-auto">Products</div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Link to="/products/create">
                            <MixinButton
                                className="w-full"
                                options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                            >
                                Create
                            </MixinButton>
                        </Link>
                        <Link to="/products">
                            <MixinButton
                                className="w-full"
                                options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                            >
                                List
                            </MixinButton>
                        </Link>
                    </div>
                </li>
                <li className="p-4 bg-gray-50 border-gray-900 border flex flex-col gap-2 sm:max-w-full max-w-96 w-full mx-auto">
                    <div className="flex flex-row gap-2 items-center">
                        <CoverImage
                            className="h-20 w-20 border border-gray-900"
                            src={
                                new URL(
                                    "/src/presentation/images/_a8b86e0e-c47a-4490-89ed-e2b2a69dcc61-removebg-preview.png",
                                    import.meta.url,
                                ).href
                            }
                        />
                        <div className="font-bold text-center mx-auto">Orders</div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Link to="/orders/create">
                            <MixinButton
                                className="w-full"
                                options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                            >
                                Create
                            </MixinButton>
                        </Link>
                        <Link to="/orders">
                            <MixinButton
                                className="w-full"
                                options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                            >
                                List
                            </MixinButton>
                        </Link>
                    </div>
                </li>
                <li className="p-4 bg-gray-50 border-gray-900 border flex flex-col gap-2 sm:max-w-full max-w-96 w-full mx-auto">
                    <div className="flex flex-row gap-2 items-center">
                        <CoverImage
                            className="h-20 w-20 border border-gray-900"
                            src={
                                new URL(
                                    "/src/presentation/images/_4766e2d9-54f8-48b5-9366-11485ac2198b-removebg-preview.png",
                                    import.meta.url,
                                ).href
                            }
                        />
                        <div className="font-bold text-center mx-auto">Product Histories</div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Link to="/product_histories">
                            <MixinButton
                                className="w-full"
                                options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                            >
                                List
                            </MixinButton>
                        </Link>
                    </div>
                </li>
            </ul>
        </div>
    );
}
