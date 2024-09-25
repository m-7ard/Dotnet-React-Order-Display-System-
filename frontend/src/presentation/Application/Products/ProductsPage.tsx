import { Link, useLoaderData, useNavigate } from "@tanstack/react-router";
import IProduct from "../../../domain/models/IProduct";
import MixinButton from "../../components/Resuables/MixinButton";
import { useApplicationExceptionContext } from "../../contexts/ApplicationExceptionHandlerContext";
import { useEffect } from "react";
import CoverImage from "../../components/Resuables/CoverImage";
import { useStateManagersContext } from "../../contexts/StateManagersContext";
import FilterProductsDialogPanel from "./_ProductsPage/FilterProductsDialogPanel";
import DeleteProductDialogPanel from "./_ProductsPage/DeleteProductDialogPanel";
import AbstractTooltip, {
    AbstractTooltipDefaultPanel,
    AbstractTooltipTrigger,
} from "../../components/Resuables/AbstractTooltip";
import { useAbstractTooltipContext } from "../../contexts/AbstractTooltipContext";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../components/Resuables/MixinPrototypeCard";
import GlobalDialog from "../../components/Dialog/GlobalDialog";

export default function ProductsPage() {
    const { productsResult } = useLoaderData({ from: "/products" });
    const { dispatchException } = useApplicationExceptionContext();
    const products = productsResult.isOk() ? productsResult.value.products : [];

    useEffect(() => {
        if (productsResult.isErr() && productsResult.error.type === "Exception") {
            dispatchException(productsResult.error.data);
        }
    }, [dispatchException, productsResult]);

    return (
        <div className="mixin-page-like mixin-page-base">
            <header className="text-2xl text-gray-900 font-bold">Products</header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <div className="flex flex-row gap-2">
                <Link to="/products/create" className="basis-1/2">
                    <MixinButton
                        className="justify-center w-full rounded shadow"
                        options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                    >
                        Create
                    </MixinButton>
                </Link>
                <GlobalDialog
                    zIndex={10}
                    Trigger={({ onToggle }) => (
                        <MixinButton
                            className="justify-center w-full rounded shadow basis-1/2"
                            options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                            onClick={onToggle}
                        >
                            Filter
                        </MixinButton>
                    )}
                    Panel={FilterProductsDialogPanel}
                    panelProps={{}}
                />
            </div>
            {products.map((product) => (
                <Product product={product} key={product.id} />
            ))}
        </div>
    );
}

function Product(props: { product: IProduct }) {
    const { product } = props;
    const productImages = product.images.map((image) => `${import.meta.env.VITE_API_URL}/Media/${image.fileName}`);
    const navigate = useNavigate();

    return (
        <MixinPrototypeCard
            options={{
                size: "mixin-Pcard-base",
                theme: "theme-Pcard-generic-white",
            }}
        >
            <MixinPrototypeCardSection className="flex flex-row gap-2">
                <CoverImage
                    className="w-24 h-24 border border-gray-400 rounded shadow overflow-hidden"
                    src={productImages[0] == null ? undefined : productImages[0]}
                />
                <div className="flex flex-col gap-1 grow">
                    <div className="text-sm font-bold">{product.name}</div>
                    <div className="text-sm">${product.price}</div>
                    <div className="mt-auto text-xs">{product.dateCreated.toLocaleString("en-us")}</div>
                </div>
            </MixinPrototypeCardSection>
            <footer className="flex flex-row gap-2" data-role="section">
                <a
                    className="w-full"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate({ to: `/orders`, search: { productId: product.id } });
                    }}
                >
                    <MixinButton
                        className="w-full justify-center rounded shadow"
                        type="button"
                        options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                    >
                        See Orders
                    </MixinButton>
                </a>
                <AbstractTooltip
                    Trigger={({ open, onToggle }) => (
                        <AbstractTooltipTrigger>
                            <MixinButton
                                className="justify-center rounded shadow"
                                type="button"
                                options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                                onClick={onToggle}
                                active={open}
                            >
                                ...
                            </MixinButton>
                        </AbstractTooltipTrigger>
                    )}
                    Panel={<ProductOptionMenu product={product} />}
                    positioning={{ top: "100%", right: "0px" }}
                />
            </footer>
        </MixinPrototypeCard>
    );
}

function ProductOptionMenu(props: { product: IProduct }) {
    const { product } = props;
    const { productStateManager } = useStateManagersContext();
    const { onClose } = useAbstractTooltipContext();
    const navigate = useNavigate();

    return (
        <AbstractTooltipDefaultPanel className={`z-10 fixed mt-1`}>
            <MixinPrototypeCard
                className="shadow rounded shadow"
                options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }}
            >
                <MixinPrototypeCardSection className="flex flex-col gap-2">
                    <a
                        className="w-full"
                        onClick={(e) => {
                            e.preventDefault();
                            productStateManager.setProduct(product);
                            navigate({ to: `/products/${product.id}/update` });
                        }}
                    >
                        <MixinButton
                            className="justify-center rounded shadow w-full"
                            type="button"
                            options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                        >
                            Update Product
                        </MixinButton>
                    </a>
                    <GlobalDialog
                        zIndex={20}
                        Trigger={({ onToggle }) => (
                            <MixinButton
                                className="justify-center rounded shadow w-full"
                                type="button"
                                options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
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
                    <MixinButton
                        className="justify-center rounded shadow"
                        type="button"
                        options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                    >
                        See Product History
                    </MixinButton>
                </MixinPrototypeCardSection>
            </MixinPrototypeCard>
        </AbstractTooltipDefaultPanel>
    );
}
