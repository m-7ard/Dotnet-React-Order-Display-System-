import { Link, useLoaderData, useNavigate, useSearch } from "@tanstack/react-router";
import { useApplicationExceptionContext } from "../../contexts/ApplicationExceptionHandlerContext";
import { useCallback, useEffect } from "react";
import MixinButton from "../../components/Resuables/MixinButton";
import { useStateManagersContext } from "../../contexts/StateManagersContext";
import Order from "../../../domain/models/Order";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../components/Resuables/MixinPrototypeCard";
import FilterProductsDialogPanel from "./_OrdersPage/FilterOrdersDialogPanel";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import OrderStatus from "../../../domain/valueObjects/Order/OrderStatus";
import OrderItemStatus from "../../../domain/valueObjects/OrderItem/OrderItemStatus";
import LinkBox from "../../components/Resuables/LinkBox";
import { useAbstractTooltipContext } from "../../contexts/AbstractTooltipContext";
import routeData from "../../routes/_routeData";
import AbstractTooltip, { AbstractTooltipDefaultPanel, AbstractTooltipTrigger } from "../../components/Resuables/AbstractTooltip";
import MixinPanel from "../../components/Resuables/MixinPanel";
import StatelessRadioCheckboxField from "../../components/StatelessFields/StatelessRadioCheckboxField";

const ORDER_ITEM_STATUS_COLORS = {
    [OrderItemStatus.FINISHED.value]: "bg-green-600/40",
    [OrderItemStatus.PENDING.value]: "bg-orange-400/60",
};

const ORDER_STATUS_COLORS = {
    [OrderStatus.FINISHED.value]: "bg-green-600/40",
    [OrderStatus.PENDING.value]: "bg-orange-400/60",
};

export default function OrdersPage() {
    const { ordersResult } = useLoaderData({ from: "/orders" });
    const { dispatchException } = useApplicationExceptionContext();

    useEffect(() => {
        if (ordersResult.isErr() && ordersResult.error.type === "Exception") {
            dispatchException(ordersResult.error.data);
        }
    }, [dispatchException, ordersResult]);

    const queryData = ordersResult.isOk() ? ordersResult.value.orders : [];

    return (
        <div className="mixin-page-like mixin-page-base max-w-full">
            <header className="flex flex-row gap-2 items-center">
                <LinkBox parts={[{ isLink: true, to: "/orders", label: "Orders" }]} />
                <div className="flex flex-row gap-2 ml-auto">
                    <Link to="/orders/create">
                        <MixinButton
                            className=""
                            options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                        >
                            Create
                        </MixinButton>
                    </Link>
                    <GlobalDialog
                        zIndex={10}
                        Trigger={({ onToggle }) => (
                            <MixinButton
                                className=" basis-1/2"
                                options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                onClick={onToggle}
                            >
                                Filter
                            </MixinButton>
                        )}
                        Panel={FilterProductsDialogPanel}
                        panelProps={{}}
                    />
                    <AbstractTooltip
                        Trigger={({ onToggle }) => (
                            <AbstractTooltipTrigger>
                                <MixinButton
                                    className="w-full truncate"
                                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                    onClick={onToggle}
                                >
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
                {queryData.map((order) => (
                    <OrderElement order={order} key={order.id} />
                ))}
            </section>
        </div>
    );
}

function OrderElement(props: { order: Order }) {
    const { order } = props;
    const navigate = useNavigate();
    const { orderStateManager } = useStateManagersContext();

    return (
        <MixinPrototypeCard
            options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }}
            className="overflow-hidden shrink-0 max-w-72 w-full sm:max-h-full flex flex-col"
        >
            <MixinPrototypeCardSection className={`flex flex-col ${ORDER_STATUS_COLORS[order.status.value]}`}>
                <div className="flex flex-row justify-between items-baseline">
                    <div className="text-sm">Order #{order.id}</div>
                    <div className="text-sm">{`${order.status.value}`}</div>
                </div>
                <div className="flex flex-row justify-between items-baseline">
                    <div className="text-sm">{order.dateCreated.toLocaleTimeString()}</div>
                    <div className="text-sm">{order.total}$</div>
                </div>
            </MixinPrototypeCardSection>
            <div className=" sm:overflow-auto">
                {order.orderItems.map((orderItem, i) => (
                    <MixinPrototypeCardSection
                        className={`flex flex-col gap-2 ${i === 0 ? "" : "border-gray-900 border-t"}`}
                        key={orderItem.id}
                    >
                        <div className="flex flex-col gap-1 overflow-hidden max-w-full">
                            <div className="flex flex-row gap-2 items-center text-base">
                                <div className="text-sm font-bold bg-gray-200 px-2 py-1/2 border border-gray-900">
                                    x{orderItem.quantity}
                                </div>
                                <div className="border-gray-900 text-sm truncate">{orderItem.productHistory.name}</div>
                                <div className="text-sm ml-auto">{`${orderItem.productHistory.price}$`}</div>
                            </div>
                            <div className="flex flex-row gap-2 items-center text-base">
                                <div
                                    className={`text-sm ${ORDER_ITEM_STATUS_COLORS[orderItem.status.value]} border px-2 py-px  border border-gray-900`}
                                >
                                    {orderItem.status.value}
                                </div>
                                <div className="text-sm ml-auto">Total - {`${orderItem.getTotal()}$`}</div>
                            </div>
                        </div>
                    </MixinPrototypeCardSection>
                ))}
            </div>

            <MixinPrototypeCardSection
                as="a"
                onClick={(e) => {
                    e.preventDefault();
                    orderStateManager.setOrder(order);
                    navigate({ to: `/orders/${order.id}/manage` });
                }}
                className="flex flex-row bg-gray-100 shrink-0"
            >
                <MixinButton
                    options={{
                        size: "mixin-button-base",
                        theme: "theme-button-generic-yellow",
                    }}
                    className="w-full justify-center"
                >
                    Manage Order
                </MixinButton>
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}

function OrderByMenu() {
    const { onClose } = useAbstractTooltipContext();
    const navigate = useNavigate();
    const searchParams: Record<string, string> = useSearch({ strict: false });

    const orderBy = searchParams.orderBy;
    const onChange = useCallback(
        (value: string) => {
            navigate({ to: routeData.listOrders.pattern, search: { ...searchParams, orderBy: value } });
            onClose();
        },
        [navigate, searchParams, onClose],
    );

    return (
        <AbstractTooltipDefaultPanel className={`z-10 fixed mt-1`}>
            <MixinPanel
                options={{
                    size: "mixin-panel-base",
                    theme: "theme-panel-generic-white",
                }}
            >
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <div className="text-sm">Newest</div>
                        <StatelessRadioCheckboxField
                            name={"orderBy"}
                            onChange={onChange}
                            value={"newest"}
                            checked={orderBy === "newest"}
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <div className="text-sm">Oldest</div>
                        <StatelessRadioCheckboxField
                            name={"orderBy"}
                            onChange={onChange}
                            value={"oldest"}
                            checked={orderBy === "oldest"}
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <div className="text-sm">Total - Lowest to Highest</div>
                        <StatelessRadioCheckboxField
                            name={"orderBy"}
                            onChange={onChange}
                            value={"total asc"}
                            checked={orderBy === "total asc"}
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <div className="text-sm">Total - Highest to Lowest</div>
                        <StatelessRadioCheckboxField
                            name={"orderBy"}
                            onChange={onChange}
                            value={"total desc"}
                            checked={orderBy === "total desc"}
                        />
                    </div>
                </div>
            </MixinPanel>
        </AbstractTooltipDefaultPanel>
    );
}
