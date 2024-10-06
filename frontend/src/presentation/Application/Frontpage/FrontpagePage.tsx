import { Link } from "@tanstack/react-router";
import LinkBox from "../../components/Resuables/LinkBox";
import CoverImage from "../../components/Resuables/CoverImage";
import MixinButton from "../../components/Resuables/MixinButton";
import { getLocalUrl } from "../../../viteUtils";

export default function FrontpagePage() {
    return (
        <div className="mixin-page-like mixin-page-base mx-auto">
            <header className="flex flex-row gap-2 items-center justify-between">
                <LinkBox parts={[]} />
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <ul className="mixin-page-content-like mixin-page-content-base sm:grid sm:grid-cols-2">
                <Navigator
                    title="Products"
                    imageUrl={getLocalUrl(
                        "/src/presentation/images/_045d1801-1987-4ce3-abd9-1b8f56fcde24-removebg-preview.png",
                    )}
                    buttons={[
                        { label: "Create", href: "/products/create" },
                        { label: "List", href: "/products" },
                    ]}
                />
                <Navigator
                    title="Orders"
                    imageUrl={getLocalUrl(
                        "/src/presentation/images/_a8b86e0e-c47a-4490-89ed-e2b2a69dcc61-removebg-preview.png",
                    )}
                    buttons={[
                        { label: "Create", href: "/orders/create" },
                        { label: "List", href: "/orders" },
                    ]}
                />
                <Navigator
                    title="Product Histories"
                    imageUrl={getLocalUrl(
                        "/src/presentation/images/_4766e2d9-54f8-48b5-9366-11485ac2198b-removebg-preview.png",
                    )}
                    buttons={[{ label: "List", href: "/product_histories" }]}
                />
            </ul>
        </div>
    );
}

function Navigator(props: { title: string; imageUrl: string; buttons: Array<{ label: string; href: string }> }) {
    const { title, imageUrl, buttons } = props;

    return (
        <li className="flex flex-col gap-2 sm:max-w-full max-w-96 w-full">
            <div className="flex flex-row gap-4 items-center relative">
                <div className="font-bold">{title}</div>
            </div>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <div className="flex flex-col gap-1">
                {buttons.map(({ label, href }) => (
                    <Link to={href}>
                        <MixinButton
                            className="w-full justify-between"
                            options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                        >
                            <div>{label}</div>
                            <div>››</div>
                        </MixinButton>
                    </Link>
                ))}
            </div>
        </li>
    );
}
