import IProduct from "../../../../domain/models/IProduct";
import MixinButton from "../../../components/Resuables/MixinButton";
import MixinPanel, { MixinPanelSection } from "../../../components/Resuables/MixinPanel";
import LinkBox from "../../../components/Resuables/LinkBox";
import routeData from "../../../routes/_routeData";
import { DeleteProductErrorSchema } from "./DeleteProduct.Controller";
import Divider from "../../../components/Resuables/Divider";

export default function DeleteProductDialogPanel(props: { product: IProduct; onSubmit: () => void; errors: DeleteProductErrorSchema; onClose: () => void }) {
    const { product, onSubmit, onClose } = props;

    return (
        <MixinPanel
            as="form"
            options={{
                size: "mixin-panel-base",
                theme: "theme-panel-generic-white",
            }}
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            <MixinPanelSection className="flex flex-row justify-between items-center">
                <LinkBox
                    parts={[
                        { isLink: true, to: routeData.listProducts.build({}), label: "Products" },
                        { isLink: false, label: "Delete" },
                    ]}
                />
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
                    type="button"
                >
                    Close
                </MixinButton>
            </MixinPanelSection>
            <Divider />
            <MixinPanelSection className="flex flex-col gap-3 text-sm">Do you wish to delete "{product.name}"? This Process cannot be undone</MixinPanelSection>
            <Divider />
            <MixinPanelSection className="flex flex-row gap-3">
                <MixinButton onClick={onClose} className="basis-1/2 justify-center" options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="button">
                    Cancel
                </MixinButton>
                <MixinButton className="basis-1/2 justify-center" options={{ size: "mixin-button-base", theme: "theme-button-generic-red" }} type="submit">
                    Delete
                </MixinButton>
            </MixinPanelSection>
        </MixinPanel>
    );
}
