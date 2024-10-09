import { useNavigate } from "@tanstack/react-router";
import IProduct from "../../../domain/models/IProduct";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import { AbstractTooltipDefaultPanel } from "../../components/Resuables/AbstractTooltip";
import MixinButton from "../../components/Resuables/MixinButton";
import MixinPanel from "../../components/Resuables/MixinPanel";
import { useAbstractTooltipContext } from "../../contexts/AbstractTooltipContext";
import { useStateManagersContext } from "../../contexts/StateManagersContext";
import DeleteProductDialogPanel from "./_ProductsPage/DeleteProductDialogPanel";


export default function ProductOptionMenu(props: { product: IProduct }) {
    const { product } = props;
    const { productStateManager } = useStateManagersContext();
    const { onClose } = useAbstractTooltipContext();
    const navigate = useNavigate();

    return (
        <AbstractTooltipDefaultPanel className={`z-10 fixed mt-1`}>
            <MixinPanel
                options={{
                    size: "mixin-panel-base",
                    theme: "theme-panel-generic-white",
                }}
            >
                <header className="flex flex-row items-center justify-between">
                    <div className="text-sm">Other Options</div>
                    <MixinButton
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-white",
                        }}
                        onClick={onClose}
                        className=" "
                        type="button"
                    >
                        Close
                    </MixinButton>
                </header>
                <hr className="h-0 w-full border-bottom border-gray-900"></hr>
                <div className="flex flex-col gap-2">
                    <a
                        className="w-full"
                        onClick={(e) => {
                            e.preventDefault();
                            productStateManager.setProduct(product);
                            navigate({ to: `/products/${product.id}/update` });
                        }}
                    >
                        <MixinButton
                            className="justify-center truncate w-full"
                            type="button"
                            options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }}
                        >
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
                        Panel={DeleteProductDialogPanel}
                        panelProps={{ product: product }}
                    />
                    <a
                        className="w-full truncate"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate({ to: "/product_histories", search: { productId: product.id } });
                        }}
                    >
                        <MixinButton
                            className="justify-center w-full"
                            type="button"
                            options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }}
                        >
                            See Product History
                        </MixinButton>
                    </a>
                </div>
            </MixinPanel>
        </AbstractTooltipDefaultPanel>
    );
}