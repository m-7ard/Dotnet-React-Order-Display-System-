import MixinButton from "../../components/Resuables/MixinButton";
import AbstractTooltip, { AbstractTooltipTrigger } from "../../components/Resuables/AbstractTooltip";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import LinkBox from "../../components/Resuables/LinkBox";
import IProductHistory from "../../../domain/models/IProductHistory";
import FilterProductHistoriesDialogPanel from "./_ProductHistories/FilterProductHistoriesDialogPanel";
import routeData from "../../routes/_routeData";
import ProductHistory from "./ProductHistories.Page.ProductHistoryElement";
import OrderByMenu from "./ProductHistories.Page.OrderByMenu";

export default function ProductHistoriesPage(props: { productHistories: IProductHistory[] }) {
    const { productHistories } = props;

    return (
        <div className="mixin-page-like mixin-page-base mx-auto">
            <header className="flex flex-row gap-2 items-center overflow-x-auto shrink-0">
                <LinkBox parts={[{ isLink: true, to: routeData.listProductHistories.build({}), label: "Product Histories" }]} />
                <div className="flex flex-row gap-2 ml-auto">
                    <GlobalDialog
                        zIndex={10}
                        Trigger={({ onToggle }) => (
                            <MixinButton className="justify-center w-full basis-1/2" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }} onClick={onToggle}>
                                Filter
                            </MixinButton>
                        )}
                        Panel={FilterProductHistoriesDialogPanel}
                        panelProps={{}}
                    />
                    <AbstractTooltip
                        Trigger={({ onToggle, open }) => (
                            <AbstractTooltipTrigger>
                                <MixinButton className="w-full truncate" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }} onClick={onToggle} active={open}>
                                    Order By
                                </MixinButton>
                            </AbstractTooltipTrigger>
                        )}
                        Panel={<OrderByMenu />}
                        positioning={{ top: "100%", right: "0px" }}
                    />
                </div>
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <section className="grid grid-cols-2 max-[576px]:grid-cols-2 max-[425px]:grid-cols-1 gap-x-2 gap-y-4">
                {productHistories.map((productHistory) => (
                    <ProductHistory productHistory={productHistory} key={productHistory.id} />
                ))}
            </section>
        </div>
    );
}
