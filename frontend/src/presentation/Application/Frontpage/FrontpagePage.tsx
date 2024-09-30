import { Link } from "@tanstack/react-router";
import Linkbox from "../../components/Resuables/LinkBox";
import CoverImage from "../../components/Resuables/CoverImage";

export default function FrontpagePage() {
    return (
        <div className="mixin-page-like mixin-page-base theme-page-generic-white">
            <section className="flex flex-col gap-[inherit] max-w-3xl w-full mx-auto">
                <header className="flex flex-row gap-2 items-center justify-between">
                    <Linkbox parts={[]} />
                </header>
                <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            </section>
            <ul className="flex flex-col gap-4 sm:grid sm:grid-cols-2 max-w-md w-full mx-auto">
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
                        <Link
                            to={"/products/create"}
                            className="mixin-button-like w-full bg-gray-50 hover:bg-gray-200 hover:border-l-[16px] transition-all px-4 py-1 text-base border-l-8 border border-gray-900"
                        >
                            Create
                        </Link>
                        <Link
                            to={"/products"}
                            className="mixin-button-like w-full bg-gray-50 hover:bg-gray-200 hover:border-l-[16px] transition-all px-4 py-1 text-base border-l-8 border border-gray-900"
                        >
                            List
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
                        <Link
                            to={"/orders/create"}
                            className="mixin-button-like w-full bg-gray-50 hover:bg-gray-200 hover:border-l-[16px] transition-all px-4 py-1 text-base border-l-8 border border-gray-900"
                        >
                            Create
                        </Link>
                        <Link
                            to={"/orders"}
                            className="mixin-button-like w-full bg-gray-50 hover:bg-gray-200 hover:border-l-[16px] transition-all px-4 py-1 text-base border-l-8 border border-gray-900"
                        >
                            List
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
                        <Link
                            to={"/product_histories"}
                            className="mixin-button-like w-full bg-gray-50 hover:bg-gray-200 hover:border-l-[16px] transition-all px-4 py-1 text-base border-l-8 border border-gray-900"
                        >
                            List
                        </Link>
                    </div>
                </li>
            </ul>
        </div>
    );
}
