import { useNavigate } from "@tanstack/react-router";
import IProduct from "../../../domain/models/IProduct";
import { getApiUrl } from "../../../viteUtils";
import AbstractTooltip, { AbstractTooltipTrigger } from "../../components/Resuables/AbstractTooltip";
import CoverImage from "../../components/Resuables/CoverImage";
import MixinButton from "../../components/Resuables/MixinButton";
import ProductOptionMenu from "./Products.Page.Product.OptionsMenu";

export default function Product(props: { product: IProduct }) {
    const { product } = props;
    const productImages = product.images.map((image) => `${getApiUrl()}/Media/${image.fileName}`);
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-2">
            <CoverImage
                className="w-full aspect-square border border-gray-900 overflow-hidden"
                src={productImages[0] == null ? undefined : productImages[0]}
            />
            <div className="flex flex-col gap-px">
                <div className="text-sm font-bold truncate" title={product.name}>{product.name}</div>
                <div className="text-sm">${product.price}</div>
                <div className="mt-auto text-xs">{product.dateCreated.toLocaleString("en-us")}</div>
            </div>
            <footer className="flex flex-col gap-2 bg-gray-100">
                <a
                    className="w-full"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate({ to: `/orders`, search: { productId: product.id } });
                    }}
                >
                    <MixinButton
                        className="w-full justify-center truncate  "
                        type="button"
                        options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }}
                    >
                        See Orders
                    </MixinButton>
                </a>
                <AbstractTooltip
                    Trigger={({ open, onToggle }) => (
                        <AbstractTooltipTrigger>
                            <MixinButton
                                className="justify-center truncate items-center w-full"
                                type="button"
                                options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                                onClick={onToggle}
                                active={open}
                            >
                                Other
                            </MixinButton>
                        </AbstractTooltipTrigger>
                    )}
                    Panel={<ProductOptionMenu product={product} />}
                    positioning={{ top: "100%", left: "0px" }}
                />
            </footer>
        </div>
    );
}
