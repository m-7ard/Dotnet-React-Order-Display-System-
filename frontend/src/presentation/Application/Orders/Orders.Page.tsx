import { Link } from "@tanstack/react-router";
import MixinButton from "../../components/Resuables/MixinButton";
import Order from "../../../domain/models/Order";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import LinkBox from "../../components/Resuables/LinkBox";
import AbstractTooltip, { AbstractTooltipTrigger } from "../../components/Resuables/AbstractTooltip";
import OrderElement from "./Orders.Page.Order";
import OrderByMenu from "./Orders.Page.OrderByMenu";
import FilterOrdersController from "./Filter/FilterOrders.Controller";

export default function OrdersPage(props: { orders: Order[] }) {
    const { orders } = props;

    return (
        <div className="mixin-page-like mixin-page-base max-w-full border-x-0">
            <header className="flex flex-row gap-2 items-center overflow-x-auto shrink-0">
                <LinkBox parts={[{ isLink: true, to: "/orders", label: "Orders" }]} />
                <div className="flex flex-row gap-2 ml-auto">
                    <Link to="/orders/create">
                        <MixinButton className="" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}>
                            Create
                        </MixinButton>
                    </Link>
                    <GlobalDialog
                        zIndex={10}
                        Trigger={({ onToggle }) => (
                            <MixinButton className=" basis-1/2" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }} onClick={onToggle}>
                                Filter
                            </MixinButton>
                        )}
                        Panel={FilterOrdersController}
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
            <section className="flex flex-col overflow-scroll gap-2 pr-4 pb-4 grow sm:flex-wrap sm:overflow-x-scroll sm:overflow-y-hidden sm:content-start">
                {orders.map((order) => (
                    <OrderElement order={order} key={order.id} />
                ))}
            </section>
        </div>
    );
}
