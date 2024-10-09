import { Link } from "@tanstack/react-router";
import LinkBox from "../../components/Resuables/LinkBox";
import MixinButton from "../../components/Resuables/MixinButton";
import { getLocalUrl } from "../../../viteUtils";
import CoverImage from "../../components/Resuables/CoverImage";

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
                        { label: "List", href: "/products" },
                        { label: "Create", href: "/products/create" },
                    ]}
                />
                <Navigator
                    title="Orders"
                    imageUrl={getLocalUrl(
                        "/src/presentation/images/_a8b86e0e-c47a-4490-89ed-e2b2a69dcc61-removebg-preview.png",
                    )}
                    buttons={[
                        { label: "List", href: "/orders" },
                        { label: "Create", href: "/orders/create" },
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
        <li className="grid gap-2 w-full items-center" style={{ gridTemplateColumns: "auto 1fr" }}>
            <CoverImage src={imageUrl} className="h-full aspect-square aspect-square border border-gray-900 bg-gray-100" />
            <div className="mixin-button-base flex justify-center items-center border border-gray-900 bg-gray-100">{title}</div>
            {buttons.map(({ label, href }) => (
                <Link to={href} className="col-start-2" key={href}>
                    <MixinButton
                        className="w-full justify-center"
                        options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }}
                    >
                        {label}
                    </MixinButton>
                </Link>
            ))}
        </li>
    );
}
