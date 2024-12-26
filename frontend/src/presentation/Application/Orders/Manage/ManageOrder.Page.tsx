import MixinButton from "../../../components/Resuables/MixinButton";
import OrderItem from "../../../../domain/models/OrderItem";
import IPresentationError from "../../../interfaces/IPresentationError";
import OrderStatus from "../../../../domain/valueObjects/Order/OrderStatus";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../../components/Resuables/MixinPrototypeCard";
import LinkBox from "../../../components/Resuables/LinkBox";
import Order from "../../../../domain/models/Order";
import routeData from "../../../routes/_routeData";
import OrderItemElement from "./ManageOrder.Page.OrderItem";
import { CONTENT_GRID } from "../../../attribute-mixins/contentGridTracks";
import Divider from "../../../components/Resuables/Divider";
import MixinPage, { MixinPageSection } from "../../../components/Resuables/MixinPage";

const ORDER_STATUS_COLORS = {
    [OrderStatus.FINISHED.value]: "bg-green-600/50",
    [OrderStatus.PENDING.value]: "bg-orange-400/70",
};

export default function ManageOrderPage(props: {
    order: Order;
    onMarkFinished: () => void;
    onMarkOrderItemFinished: (orderItem: OrderItem) => void;
    errors: IPresentationError<Record<string | number, unknown>>;
}) {
    const { order, onMarkFinished, onMarkOrderItemFinished } = props;

    return (
        <MixinPage
            options={{
                size: "mixin-page-base",
            }}
            className={`${CONTENT_GRID.CLASS}`}
        >
            <MixinPageSection className="flex flex-row gap-3 items-center">
                <LinkBox
                    parts={[
                        { isLink: true, to: routeData.listOrders.build({}), label: "Orders" },
                        { isLink: false, label: order.serialNumber },
                        { isLink: true, to: routeData.manageOrder.build({ id: order.id }), label: "Manage" },
                    ]}
                />
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="flex flex-col gap-3">
                <MixinPrototypeCard options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }} hasDivide hasShadow>
                    <MixinPrototypeCardSection className={`flex flex-col ${ORDER_STATUS_COLORS[order.status.value]}`}>
                        <div className="flex flex-row justify-between items-baseline">
                            <div className="token-card--header--primary-text">Order #{order.serialNumber}</div>
                            <div className="token-card--header--primary-text">{`${order.status.value}`}</div>
                        </div>
                        <div className="flex flex-row justify-between items-baseline">
                            <div className="token-card--header--secondary-text">{order.dateCreated.toLocaleTimeString()}</div>
                            <div className="token-card--header--secondary-text">{order.total}$</div>
                        </div>
                    </MixinPrototypeCardSection>
                    <MixinPrototypeCardSection>
                        <div className="flex flex-row gap-3">
                            {order.status === OrderStatus.PENDING && (
                                <>
                                    <MixinButton
                                        className={`basis-1/2 justify-center ${order.canMarkFinished() ? "" : "contrast-50 cursor-not-allowed"}`}
                                        options={{ size: "mixin-button-sm", theme: "theme-button-generic-green" }}
                                        onClick={onMarkFinished}
                                    >
                                        Mark Finished
                                    </MixinButton>
                                    <MixinButton className="basis-1/2 justify-center" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}>
                                        Other Options
                                    </MixinButton>
                                </>
                            )}
                            {order.status === OrderStatus.FINISHED && (
                                <>
                                    <MixinButton className="basis-1/2 justify-center" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}>
                                        Order Progress
                                    </MixinButton>
                                    <MixinButton className="basis-1/2 justify-center" options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}>
                                        Other Options
                                    </MixinButton>
                                </>
                            )}
                        </div>
                    </MixinPrototypeCardSection>
                </MixinPrototypeCard>
                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
                    {order.orderItems.map((orderItem) => (
                        <OrderItemElement orderItem={orderItem} key={orderItem.id} onMarkOrderItenFinished={() => onMarkOrderItemFinished(orderItem)} />
                    ))}
                </div>
            </MixinPageSection>
        </MixinPage>
    );
}
