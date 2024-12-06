import { useNavigate } from "@tanstack/react-router";
import { getApiUrl } from "../../../viteUtils";
import AbstractTooltip, { AbstractTooltipTrigger } from "../../components/Resuables/AbstractTooltip";
import CoverImage from "../../components/Resuables/CoverImage";
import MixinButton from "../../components/Resuables/MixinButton";
import OptionMenu from "./ProductHistories.Page.ProductHistoryElement.OptionMenu";
import ProductHistory from "../../../domain/models/IProductHistory";

export default function ProductHistoryElement(props: { productHistory: ProductHistory }) {
    const { productHistory } = props;
    const productImages = productHistory.images.map((image) => `${getApiUrl()}/Media/${image}`);
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
                <CoverImage className="aspect-square basis-1/3 border border-gray-900 overflow-hidden shrink-0" src={productImages[0] == null ? undefined : productImages[0]} />
                <div className="flex flex-col gap-1 grow overflow-hidden">
                    <div className="text-sm font-bold truncate" title={productHistory.name}>
                        {productHistory.name}
                    </div>
                    <div className="text-sm">${productHistory.price}</div>
                </div>
            </div>
            <div>
                <div className="flex flex-row gap-2">
                    <div className="text-xs font-bold">Original Product Id</div>
                    <div className="text-xs">{productHistory.productId}</div>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="text-xs font-bold">Valid From</div>
                    <div className="text-xs">{productHistory.validFrom.toLocaleString("en-us")}</div>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="text-xs font-bold">Valid To</div>
                    <div className="text-xs">{productHistory.isValid() ? productHistory.validTo.toLocaleString("en-us") : "N/A"}</div>
                </div>
            </div>
            <footer className="flex flex-col gap-2 bg-gray-100">
                <a
                    className="w-full"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate({
                            to: `/orders`,
                            search: {
                                productHistoryId: productHistory.id,
                            },
                        });
                    }}
                >
                    <MixinButton className="w-full justify-center  " type="button" options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }}>
                        See Orders
                    </MixinButton>
                </a>
                <AbstractTooltip
                    Trigger={({ open, onToggle }) => (
                        <AbstractTooltipTrigger>
                            <MixinButton className="justify-center w-full" type="button" options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} onClick={onToggle} active={open}>
                                More
                            </MixinButton>
                        </AbstractTooltipTrigger>
                    )}
                    Panel={<OptionMenu productHistory={productHistory} />}
                    positioning={{ top: "100%", right: "0px", left: "0px" }}
                />
            </footer>
        </div>
    );
}
