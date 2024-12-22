import { useNavigate } from "@tanstack/react-router";
import IProduct from "../../../domain/models/IProduct";
import { getApiUrl } from "../../../viteUtils";
import AbstractTooltip, { AbstractTooltipTrigger } from "../../components/Resuables/AbstractTooltip";
import CoverImage from "../../components/Resuables/CoverImage";
import MixinButton from "../../components/Resuables/MixinButton";
import ProductOptionMenu from "./Products.Page.Product.OptionsMenu";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../components/Resuables/MixinPrototypeCard";

export default function ProductElement(props: { product: IProduct }) {
    const { product } = props;
    const productImages = product.images.map((image) => `${getApiUrl()}/Media/${image.fileName}`);
    const navigate = useNavigate();

    return (
        <MixinPrototypeCard
            options={{
                size: "mixin-Pcard-base",
                theme: "theme-Pcard-generic-white",
            }}
        >
            <MixinPrototypeCardSection className="grid gap-3" style={{ gridTemplateColumns: "auto 1fr" }}>
                <CoverImage className="aspect-square h-full overflow-hidden shrink-0 rounded-lg bg-gray-300" src={productImages[0]} />
                <div>
                    <div className="text-base font-bold truncate" title={product.name}>
                        {product.name}
                    </div>
                    <div className="text-sm truncate">${product.price}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection>
                <div className="flex flex-row justify-between">
                    <div className="text-sm font-bold">Date Created</div>
                    <div className="text-sm truncate">{product.dateCreated.toLocaleString("en-us")}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-col gap-1">
                <a
                    className="w-full"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate({ to: `/orders`, search: { productId: product.id } });
                    }}
                >
                    <MixinButton className="w-full justify-center truncate  " type="button" options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }}>
                        See Orders
                    </MixinButton>
                </a>
                <AbstractTooltip
                    Trigger={({ open, onToggle }) => (
                        <AbstractTooltipTrigger>
                            <MixinButton className="justify-center truncate items-center w-full" type="button" options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} onClick={onToggle} active={open}>
                                Other
                            </MixinButton>
                        </AbstractTooltipTrigger>
                    )}
                    Panel={<ProductOptionMenu product={product} />}
                    positioning={{ top: "100%", left: "0px" }}
                />
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
