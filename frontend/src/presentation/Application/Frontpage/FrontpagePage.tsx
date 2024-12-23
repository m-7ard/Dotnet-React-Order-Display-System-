import { Link } from "@tanstack/react-router";
import LinkBox from "../../components/Resuables/LinkBox";
import { getLocalUrl } from "../../../viteUtils";
import CoverImage from "../../components/Resuables/CoverImage";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../components/Resuables/MixinPrototypeCard";
import MixinButton from "../../components/Resuables/MixinButton";
import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import { CONTENT_GRID } from "../../attribute-mixins/contentGridTracks";
import Divider from "../../components/Resuables/Divider";

export default function FrontpagePage() {
    return (
        <MixinPage
            className={`${CONTENT_GRID.CLASS}`}
            options={{
                size: "mixin-page-base",
            }}
        >
            <MixinPageSection className="flex flex-row gap-3 items-center justify-between">
                <LinkBox parts={[]} />
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="grid grid-cols-2 max-[576px]:grid-cols-2 max-[445px]:grid-cols-1 gap-3">
                <Navigator
                    title="Products"
                    imageUrl={getLocalUrl("/src/presentation/images/_045d1801-1987-4ce3-abd9-1b8f56fcde24-removebg-preview.png")}
                    buttons={[
                        { label: "List", href: "/products" },
                        { label: "Create", href: "/products/create" },
                    ]}
                />
                <Navigator
                    title="Orders"
                    imageUrl={getLocalUrl("/src/presentation/images/_a8b86e0e-c47a-4490-89ed-e2b2a69dcc61-removebg-preview.png")}
                    buttons={[
                        { label: "List", href: "/orders" },
                        { label: "Create", href: "/orders/create" },
                    ]}
                />
                <Navigator title="Product Histories" imageUrl={getLocalUrl("/src/presentation/images/_4766e2d9-54f8-48b5-9366-11485ac2198b-removebg-preview.png")} buttons={[{ label: "List", href: "/product_histories" }]} />
            </MixinPageSection>
        </MixinPage>
    );
}

function Navigator(props: { title: string; imageUrl: string; buttons: Array<{ label: string; href: string }> }) {
    const { title, imageUrl, buttons } = props;

    return (
        <MixinPrototypeCard
            style={{ gridTemplateColumns: "auto 1fr" }}
            options={{
                size: "mixin-Pcard-base",
                theme: "theme-Pcard-generic-white",
            }}
            hasShadow
            hasDivide
        >
            <MixinPrototypeCardSection className="flex flex-row gap-3">
                <div className="flex gap-3 bg-white w-full">
                    <MixinButton
                        options={{
                            size: "mixin-button-base",
                            theme: "theme-button-generic-white",
                        }}
                        isStatic
                        className="w-full justify-center"
                    >
                        <CoverImage src={imageUrl} className="h-full aspect-square" />
                        <div className="truncate">{title}</div>
                    </MixinButton>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-col gap-3">
                {buttons.map(({ label, href }) => (
                    <Link to={href} className="col-start-2" key={href}>
                        <MixinButton className="w-full justify-center" options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }}>
                            {label}
                        </MixinButton>
                    </Link>
                ))}
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
