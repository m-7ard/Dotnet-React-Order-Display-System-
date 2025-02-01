import { Link } from "@tanstack/react-router";
import MixinButton from "../../components/Resuables/MixinButton";
import Order from "../../../domain/models/Order";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import LinkBox from "../../components/Resuables/LinkBox";
import OrderElement from "./Orders.Page.OrderElement";
import OrderByMenu from "./Orders.Page.OrderByMenu";
import FilterOrdersController from "./Filter/FilterOrders.Controller";
import Divider from "../../components/Resuables/Divider";
import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import { CONTENT_GRID } from "../../attribute-mixins/contentGridTracks";
import AbstractTooltip, { AbstractTooltipTrigger } from "../../components/renderAbstractTooltip/AbstractTooltip";

export default function OrdersPage(props: { orders: Order[] }) {
    const { orders } = props;

    return (
        <MixinPage
            exp={{
                size: "mixin-page-base",
            }}
            className={`overflow-hidden ${CONTENT_GRID.CLASS}`}
            {...CONTENT_GRID.DEFAULT_TRACKS.full}
        >
            <MixinPageSection className="flex flex-row gap-3 items-center overflow-x-auto shrink-0">
                <LinkBox parts={[{ isLink: true, to: "/orders", label: "Orders" }]} />
                <div className="flex flex-row gap-3 ml-auto">
                    <Link to="/orders/create">
                        <MixinButton className="" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }} hasShadow>
                            Create
                        </MixinButton>
                    </Link>
                    <GlobalDialog
                        zIndex={10}
                        Trigger={({ onToggle }) => (
                            <MixinButton className=" basis-1/2" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }} onClick={onToggle} hasShadow>
                                Filter
                            </MixinButton>
                        )}
                        Panel={FilterOrdersController}
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
                        Panel={OrderByMenu}
                        positioning={{ top: "100%", right: "0px" }}
                    />
                </div>
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="flex flex-col grow overflow-scroll sm:overflow-x-scroll sm:overflow-y-hidden">
                <div className="flex flex-col max-h-full gap-3 grow sm:flex-wrap sm:content-start">
                    {orders.map((order) => (
                        <OrderElement order={order} key={order.id} />
                    ))}
                </div>
            </MixinPageSection>
        </MixinPage>
    );
}
