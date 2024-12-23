import MixinButton from "../../components/Resuables/MixinButton";
import AbstractTooltip, { AbstractTooltipTrigger } from "../../components/Resuables/AbstractTooltip";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import LinkBox from "../../components/Resuables/LinkBox";
import ProductHistory from "../../../domain/models/IProductHistory";
import routeData from "../../routes/_routeData";
import OrderByMenu from "./ProductHistories.Page.OrderByMenu";
import FilterProductHistoriesController from "./Filter/FilterProductHistories.Controller";
import ProductHistoryElement from "./ProductHistories.Page.ProductHistoryElement";
import contentGridTracks from "../../attribute-mixins/contentGridTracks";
import pageSection from "../../attribute-mixins/pageSection";
import Divider from "../../components/Resuables/Divider";

export default function ProductHistoriesPage(props: { productHistories: ProductHistory[] }) {
    const { productHistories } = props;

    return (
        <div className="mixin-page-like mixin-page-base mixin-content-grid">
            <header className="flex flex-row gap-2 items-center overflow-x-auto shrink-0" {...pageSection} {...contentGridTracks.base}>
                <LinkBox parts={[{ isLink: true, to: routeData.listProductHistories.build({}), label: "Product Histories" }]} />
                <div className="flex flex-row gap-2 ml-auto">
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
            </header>
            <Divider {...contentGridTracks.base}></Divider>
            <section className="grid grid-cols-2 max-[576px]:grid-cols-2 max-[445px]:grid-cols-1 gap-3" {...pageSection} {...contentGridTracks.base}>
                {productHistories.map((productHistory) => (
                    <ProductHistoryElement productHistory={productHistory} key={productHistory.id} />
                ))}
            </section>
        </div>
    );
}
