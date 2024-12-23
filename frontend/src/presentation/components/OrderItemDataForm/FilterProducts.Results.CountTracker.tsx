import IProduct from "../../../domain/models/IProduct";
import { getApiUrl } from "../../../viteUtils";
import CoverImage from "../Resuables/CoverImage";
import MixinButton from "../Resuables/MixinButton";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../Resuables/MixinPrototypeCard";

export default function CountTrackerProduct(props: { product: IProduct; onAdd: () => void; isAdded: boolean; quantity: number }) {
    const { product, onAdd, isAdded, quantity } = props;
    const productImages = product.images.map((image) => `${getApiUrl()}/Media/${image.fileName}`);

    return (
        <MixinPrototypeCard
            options={{
                size: "mixin-Pcard-base",
                theme: "theme-Pcard-generic-white",
            }}
            hasBorder
            hasShadow
            hasDivide
        >
            <MixinPrototypeCardSection className="grid gap-3" style={{ gridTemplateColumns: "auto 1fr" }}>
                <CoverImage className="token-default-avatar" src={productImages[0]} />
                <div className="overflow-hidden">
                    <div className="text-base font-bold truncate" title={product.name}>
                        {product.name}
                    </div>
                    <div className="text-sm truncate">${product.price}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection>
                <div className="flex flex-row gap-3">
                    <div className="text-xs font-bold">Date Created</div>
                    <div className="text-xs truncate">{product.dateCreated.toLocaleString("en-us")}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-row gap-3">
                {isAdded ? (
                    <>
                        <div className="mixin-button-like mixin-button-base bg-gray-200 border border-gray-900">x{quantity}</div>
                        <MixinButton className="grow justify-center" options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }}>
                            Already Added
                        </MixinButton>
                    </>
                ) : (
                    <MixinButton className="grow justify-center" options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }} onClick={onAdd}>
                        Add Item
                    </MixinButton>
                )}
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
