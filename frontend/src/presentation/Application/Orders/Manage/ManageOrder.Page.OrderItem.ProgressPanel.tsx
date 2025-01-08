import OrderItem from "../../../../domain/models/OrderItem";
import { useGlobalDialogPanelContext } from "../../../components/Dialog/GlobalDialog.Panel.Context";
import Divider from "../../../components/Resuables/Divider";
import MixinButton from "../../../components/Resuables/MixinButton";
import MixinPanel, { MixinPanelSection } from "../../../components/Resuables/MixinPanel";

export default function OrderItemProgressPanel(props: { orderItem: OrderItem }) {
    const { orderItem } = props;
    const { onClose } = useGlobalDialogPanelContext();

    return (
        <MixinPanel
            options={{
                size: "mixin-panel-base",
                theme: "theme-panel-generic-white",
            }}
            hasBorder
            hasShadow
        >
            <MixinPanelSection className="flex flex-row justify-between items-center">
                <div className="token-base-title">Order Item #{orderItem.serialNumber} Progress</div>
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
                    type="button"
                    hasShadow
                >
                    Close
                </MixinButton>
            </MixinPanelSection>
            <Divider />
            <MixinPanelSection className="flex flex-col gap-3">
                <div className="token-default-list">
                    <div className="token-default-list__label">Date Created</div>
                    <div className="token-default-list__value">{orderItem.dateCreated.toLocaleString("en-us")}</div>
                </div>
                <div className="token-default-list">
                    <div className="token-default-list__label">Date Finished</div>
                    <div className="token-default-list__value">{orderItem.dateFinished == null ? "N/A" : orderItem.dateFinished.toLocaleString("en-us")}</div>
                </div>
            </MixinPanelSection>
        </MixinPanel>
    );
}