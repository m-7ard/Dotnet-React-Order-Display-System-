import IProduct from "../../../domain/models/IProduct";
import { getApiUrl } from "../../../viteUtils";
import CoverImage from "../Resuables/CoverImage";
import MixinButton from "../Resuables/MixinButton";

export default function CountTrackerProduct(props: { product: IProduct; onAdd: () => void }) {
    const { product, onAdd } = props;
    const productImages = product.images;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
                <CoverImage className="h-20 w-20 border border-gray-900 overflow-hidden shrink-0" src={productImages[0] == null ? undefined : `${getApiUrl()}/${productImages[0].url}`} />
                <div className="flex flex-col gap-px overflow-hidden">
                    <div className="text-sm font-bold truncate" title={product.name}>
                        {product.name}
                    </div>
                    <div className="text-sm">${product.price}</div>
                    <div className="mt-auto text-xs">{product.dateCreated.toLocaleString("en-us")}</div>
                </div>
            </div>
            <footer className="flex flex-row gap-2">
                <div className="mixin-button-like mixin-button-base bg-gray-200 border border-gray-900">x</div>
                <MixinButton className="grow justify-center" options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }} onClick={onAdd}>
                    Add Item
                </MixinButton>
            </footer>
        </div>
    );
}
