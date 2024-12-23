import MixinButton from "../../components/Resuables/MixinButton";
import AbstractTooltip, { AbstractTooltipTrigger } from "../../components/Resuables/AbstractTooltip";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import LinkBox from "../../components/Resuables/LinkBox";
import ProductHistory from "../../../domain/models/IProductHistory";
import routeData from "../../routes/_routeData";
import OrderByMenu from "./ProductHistories.Page.OrderByMenu";
import FilterProductHistoriesController from "./Filter/FilterProductHistories.Controller";
import ProductHistoryElement from "./ProductHistories.Page.ProductHistoryElement";
import Divider from "../../components/Resuables/Divider";
import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import { CONTENT_GRID } from "../../attribute-mixins/contentGridTracks";

export default function ProductHistoriesPage(props: { productHistories: ProductHistory[] }) {
    const { productHistories } = props;

    return (
        <MixinPage
            className={`${CONTENT_GRID.CLASS}`}
            options={{
                size: "mixin-page-base",
            }}
        >
            <MixinPageSection className="flex flex-row gap-3 items-center overflow-x-auto shrink-0">
                <LinkBox parts={[{ isLink: true, to: routeData.listProductHistories.build({}), label: "Product Histories" }]} />
                <div className="flex flex-row gap-3 ml-auto">
                    <GlobalDialog
                        zIndex={10}
                        Trigger={({ onToggle }) => (
                            <MixinButton className="justify-center w-full basis-1/2" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }} onClick={onToggle} hasShadow>
                                Filter
                            </MixinButton>
                        )}
                        Panel={FilterProductHistoriesController}
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
            <Divider></Divider>
            <MixinPageSection className="grid grid-cols-2 max-[576px]:grid-cols-2 max-[445px]:grid-cols-1 gap-3">
                {productHistories.map((productHistory) => (
                    <ProductHistoryElement productHistory={productHistory} key={productHistory.id} />
                ))}
            </MixinPageSection>
        </MixinPage>
    );
}
