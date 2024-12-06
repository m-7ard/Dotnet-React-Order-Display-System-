import { useNavigate } from "@tanstack/react-router";
import ProductHistory from "../../../domain/models/IProductHistory";
import { AbstractTooltipDefaultPanel } from "../../components/Resuables/AbstractTooltip";
import MixinButton from "../../components/Resuables/MixinButton";
import MixinPanel from "../../components/Resuables/MixinPanel";
import { useAbstractTooltipContext } from "../../contexts/AbstractTooltipContext";

export default function OptionMenu(props: { productHistory: ProductHistory }) {
    const { productHistory } = props;
    const navigate = useNavigate();
    const { onClose } = useAbstractTooltipContext();

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
                            navigate({ to: "/products", search: { id: productHistory.productId } });
                        }}
                    >
                        <MixinButton className="justify-center w-full" type="button" options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}>
                            See Products
                        </MixinButton>
                    </a>
                </div>
            </MixinPanel>
        </AbstractTooltipDefaultPanel>
    );
}
