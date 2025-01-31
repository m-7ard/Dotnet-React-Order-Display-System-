import { useNavigate } from "@tanstack/react-router";
import IProduct from "../../../domain/models/IProduct";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import { AbstractTooltipDefaultPanel } from "../../components/AbtractTooltip/AbstractTooltip";
import MixinButton from "../../components/Resuables/MixinButton";
import MixinPanel, { MixinPanelSection } from "../../components/Resuables/MixinPanel";
import { useAbstractTooltipContext } from "../../components/AbtractTooltip/AbstractTooltip.Context";
import DeleteProductFactory from "./Delete/DeleteProduct.Factory";
import Divider from "../../components/Resuables/Divider";

export default function ProductOptionMenu(props: { product: IProduct }) {
    const { product } = props;
    const { onClose } = useAbstractTooltipContext();
    const navigate = useNavigate();

    return (
        <AbstractTooltipDefaultPanel className={`z-10 fixed mt-1`}>
            <MixinPanel
                options={{
                    size: "mixin-panel-base",
                    theme: "theme-panel-generic-white",
                }}
                hasShadow
                hasBorder
            >
                <MixinPanelSection className="flex flex-row items-center justify-between gap-3">
                    <div className="text-sm">Other Options</div>
                    <MixinButton
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-white",
                        }}
                        onClick={onClose}
                        hasShadow
                        type="button"
                    >
                        Close
                    </MixinButton>
                </MixinPanelSection>
                <Divider />
                <MixinPanelSection className="flex flex-col gap-1">
                    <a
                        className="w-full"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate({ to: `/products/${product.id}/update` });
                        }}
                    >
                        <MixinButton className="justify-center truncate w-full" type="button" options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }}>
                            Update Product
                        </MixinButton>
                    </a>
                    <GlobalDialog
                        zIndex={20}
                        Trigger={({ onToggle }) => (
                            <MixinButton
                                className="justify-center w-full"
                                type="button"
                                options={{ size: "mixin-button-base", theme: "theme-button-generic-red" }}
                                onClick={() => {
                                    onToggle();
                                    onClose();
                                }}
                            >
                                Delete Product
                            </MixinButton>
                        )}
                        Panel={() => <DeleteProductFactory product={product} />}
                        panelProps={{ product: product }}
                    />
                    <a
                        className="w-full truncate"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate({ to: "/product_histories", search: { productId: product.id } });
                        }}
                    >
                        <MixinButton className="justify-center w-full" type="button" options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }}>
                            See Product History
                        </MixinButton>
                    </a>
                </MixinPanelSection>
            </MixinPanel>
        </AbstractTooltipDefaultPanel>
    );
}
