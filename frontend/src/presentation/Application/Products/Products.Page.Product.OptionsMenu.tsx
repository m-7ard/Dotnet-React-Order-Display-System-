import { useNavigate } from "@tanstack/react-router";
import IProduct from "../../../domain/models/IProduct";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import MixinButton from "../../components/Resuables/MixinButton";
import { useAbstractTooltipContext } from "../../components/AbtractTooltip/AbstractTooltip.Context";
import DeleteProductFactory from "./Delete/DeleteProduct.Factory";
import Divider from "../../components/Resuables/Divider";
import { PolymorphicAbstractTooltipDefaultPanel } from "../../components/renderAbstractTooltip/AbstractTooltip";
import { PolymorphicMixinPanel, PolymorphicMixinPanelSection } from "../../components/Resuables/MixinPanel";

export default function ProductOptionMenu(props: { product: IProduct }) {
    const { product } = props;
    const { onClose } = useAbstractTooltipContext();
    const navigate = useNavigate();

    return (
        <PolymorphicAbstractTooltipDefaultPanel className={`z-10 fixed mt-1`}>
            <PolymorphicMixinPanel
                options={{
                    size: "mixin-panel-base",
                    theme: "theme-panel-generic-white",
                }}
                hasShadow
                hasBorder
            >
                <PolymorphicMixinPanelSection className="flex flex-row items-center justify-between gap-3">
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
                </PolymorphicMixinPanelSection>
                <Divider />
                <PolymorphicMixinPanelSection className="flex flex-col gap-1">
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
                </PolymorphicMixinPanelSection>
            </PolymorphicMixinPanel>
        </PolymorphicAbstractTooltipDefaultPanel>
    );
}
