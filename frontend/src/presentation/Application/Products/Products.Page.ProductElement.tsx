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
            className="h-fit"
        >
            <MixinPrototypeCardSection className="flex flex-row gap-2">
                <CoverImage className="aspect-square basis-1/3 w-full border border-gray-900 overflow-hidden shrink-0" src={productImages[0] == null ? undefined : productImages[0]} />
                <div className="flex flex-col gap-px overflow-hidden">
                    <div className="overflow-hidden">
                        <div className="text-xs font-bold">Name</div>
                        <div className="text-sm truncate" title={product.name}>
                            {product.name}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-bold">Price</div>
                        <div className="text-sm truncate">${product.price}</div>
                    </div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection>
                <div className="flex flex-row gap-2">
                    <div className="text-xs font-bold">Date Created</div>
                    <div className="text-xs truncate">{product.dateCreated.toLocaleString("en-us")}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-col gap-2 bg-gray-100">
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
