import { Link } from "@tanstack/react-router";
import MixinButton from "../../components/Resuables/MixinButton";
import Order from "../../../domain/models/Order";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import LinkBox from "../../components/Resuables/LinkBox";
import AbstractTooltip, { AbstractTooltipTrigger } from "../../components/Resuables/AbstractTooltip";
import OrderElement from "./Orders.Page.OrderElement";
import OrderByMenu from "./Orders.Page.OrderByMenu";
import FilterOrdersController from "./Filter/FilterOrders.Controller";
import pageSection from "../../attribute-mixins/pageSection";
import contentGridTracks from "../../attribute-mixins/contentGridTracks";
import Divider from "../../components/Resuables/Divider";

export default function OrdersPage(props: { orders: Order[] }) {
    const { orders } = props;

    return (
        <div className="mixin-page-like mixin-page-base mixin-content-grid overflow-hidden">
            <header className="flex flex-row gap-3 items-center overflow-x-auto shrink-0" {...pageSection} {...contentGridTracks.full}>
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
                        Panel={<OrderByMenu />}
                        positioning={{ top: "100%", right: "0px" }}
                    />
                </div>
            </header>
            <Divider {...contentGridTracks.full}></Divider>
            <section className="flex flex-col grow overflow-scroll sm:overflow-x-scroll sm:overflow-y-hidden" {...pageSection} {...contentGridTracks.full}>
                <div className="flex flex-col max-h-full  gap-3 grow sm:flex-wrap sm:content-start">
                    {orders.map((order) => (
                        <OrderElement order={order} key={order.id} />
                    ))}
                </div>
            </section>
        </div>
    );
}
