import LinkBox from "../../components/Resuables/LinkBox";
import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import { CONTENT_GRID } from "../../attribute-mixins/contentGridTracks";
import Divider from "../../components/Resuables/Divider";
import Navigator from "./Frontpage.Page.Navigator";
import ordersImageUrl from "../../images/_a8b86e0e-c47a-4490-89ed-e2b2a69dcc61-removebg-preview.png";
import productsImageUrl from "../../images/_045d1801-1987-4ce3-abd9-1b8f56fcde24-removebg-preview.png";
import productHistoriesImageUrl from "../../images/_4766e2d9-54f8-48b5-9366-11485ac2198b-removebg-preview.png";

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
                    imageUrl={productsImageUrl}
                    buttons={[
                        { label: "List", href: "/products" },
                        { label: "Create", href: "/products/create" },
                    ]}
                />
                <Navigator
                    title="Orders"
                    imageUrl={ordersImageUrl}
                    buttons={[
                        { label: "List", href: "/orders" },
                        { label: "Create", href: "/orders/create" },
                    ]}
                />
                <Navigator
                    title="Product Histories"
                    imageUrl={productHistoriesImageUrl}
                    buttons={[{ label: "List", href: "/product_histories" }]}
                />
            </MixinPageSection>
        </MixinPage>
    );
}
