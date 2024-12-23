import { useNavigate } from "@tanstack/react-router";
import { getApiUrl } from "../../../viteUtils";
import AbstractTooltip, { AbstractTooltipTrigger } from "../../components/Resuables/AbstractTooltip";
import CoverImage from "../../components/Resuables/CoverImage";
import MixinButton from "../../components/Resuables/MixinButton";
import OptionMenu from "./ProductHistories.Page.ProductHistoryElement.OptionMenu";
import ProductHistory from "../../../domain/models/IProductHistory";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../components/Resuables/MixinPrototypeCard";

export default function ProductHistoryElement(props: { productHistory: ProductHistory }) {
    const { productHistory } = props;
    const productImages = productHistory.images.map((image) => `${getApiUrl()}/Media/${image}`);
    const navigate = useNavigate();

    return (
        <MixinPrototypeCard
            options={{
                size: "mixin-Pcard-base",
                theme: "theme-Pcard-generic-white",
            }}
            hasDivide
            hasShadow
        >
            <MixinPrototypeCardSection className="grid gap-3" style={{ gridTemplateColumns: "auto 1fr" }}>
                <CoverImage className="token-default-avatar" src={productImages[0]} />
                <div className="overflow-hidden">
                    <div className="text-base font-bold truncate" title={productHistory.name}>
                        {productHistory.name}
                    </div>
                    <div className="text-sm truncate">${productHistory.price}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection>
                <div className="token-card--list">
                    <span className="token-card--list-label--text shrink-0">Original Product Id</span>
                    <span className="truncate token-card--list-value--text">{productHistory.productId}</span>
                </div>
                <div className="token-card--list">
                    <span className="token-card--list-label--text shrink-0">Valid From</span>
                    <span className="truncate token-card--list-value--text">{productHistory.validFrom.toLocaleString("en-us")}</span>
                </div>
                <div className="token-card--list">
                    <span className="token-card--list-label--text shrink-0">Valid To</span>
                    <span className="truncate token-card--list-value--text">{productHistory.isValid() ? productHistory.validTo.toLocaleString("en-us") : "N/A"}</span>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-col gap-3">
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
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
