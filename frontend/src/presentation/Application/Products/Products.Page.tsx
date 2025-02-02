import { Link } from "@tanstack/react-router";
import MixinButton from "../../components/Resuables/MixinButton";
import AbstractTooltip, { AbstractTooltipTrigger } from "../../components/AbtractTooltip/AbstractTooltip";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import LinkBox from "../../components/Resuables/LinkBox";
import routeData from "../../routes/_routeData";
import OrderByMenu from "./Products.Page.OrderByMenu";
import IProduct from "../../../domain/models/IProduct";
import ProductElement from "./Products.Page.ProductElement";
import FilterProductsController from "./Filter/FilterProducts.Controller";
import Divider from "../../components/Resuables/Divider";
import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import { CONTENT_GRID } from "../../attribute-mixins/contentGridTracks";

export default function ProductsPage(props: { products: IProduct[] }) {
    const { products } = props;

    return (
        <MixinPage
            className={`${CONTENT_GRID.CLASS}`}
            options={{
                size: "mixin-page-base",
            }}
        >
            <MixinPageSection className="flex flex-row gap-3 items-center shrink-0 overflow-x-auto">
                <LinkBox parts={[{ isLink: true, to: routeData.createProduct.build({}), label: "Products" }]} />
                <div className="flex flex-row gap-3 ml-auto">
                    <Link to="/products/create">
                        <MixinButton className="justify-center w-full" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }} hasShadow>
                            Create
                        </MixinButton>
                    </Link>
                    <GlobalDialog
                        zIndex={10}
                        Trigger={({ onToggle }) => (
                            <MixinButton className="justify-center w-full basis-1/2" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }} onClick={onToggle} hasShadow>
                                Filter
                            </MixinButton>
                        )}
                        Panel={FilterProductsController}
                        panelProps={{}}
                    />
                    <AbstractTooltip
                        Trigger={({ onToggle, open }) => (
                            <AbstractTooltipTrigger>
                                <MixinButton className="w-full truncate" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }} onClick={onToggle} active={open} hasShadow>
                                    Order By
                                </MixinButton>
                            </AbstractTooltipTrigger>
                        )}
                        Panel={<OrderByMenu />}
                        positioning={{ top: "100%", right: "0px" }}
                    />
                </div>
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="grid grid-cols-2 max-[576px]:grid-cols-2 max-[445px]:grid-cols-1 gap-4">
                {products.map((product) => (
                    <ProductElement product={product} key={product.id} />
                ))}
            </MixinPageSection>
        </MixinPage>
    );
}
