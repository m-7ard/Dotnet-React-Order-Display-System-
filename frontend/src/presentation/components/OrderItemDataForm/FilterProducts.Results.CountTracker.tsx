import IProduct from "../../../domain/models/IProduct";
import { getApiUrl } from "../../../viteUtils";
import CoverImage from "../Resuables/CoverImage";
import MixinButton from "../Resuables/MixinButton";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../Resuables/MixinPrototypeCard";

export default function CountTrackerProduct(props: { product: IProduct; onAdd: () => void; isAdded: boolean; quantity: number }) {
    const { product, onAdd, isAdded, quantity } = props;
    const productImages = product.images;

    return (
        <MixinPrototypeCard options={{
            size: "mixin-Pcard-base",
            theme: "theme-Pcard-generic-white"
        }}>
            <MixinPrototypeCardSection className="flex flex-row gap-2">
                <CoverImage className="basis-1/3 aspect-square border border-gray-900 overflow-hidden shrink-0" src={productImages[0] == null ? undefined : `${getApiUrl()}/${productImages[0].url}`} />
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
            <MixinPrototypeCardSection className="flex flex-row gap-2">
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
