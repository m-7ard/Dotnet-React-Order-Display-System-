import { Link, useLoaderData, useNavigate } from "@tanstack/react-router";
import IProduct from "../../../domain/models/IProduct";
import MixinButton from "../../components/Resuables/MixinButton";
import { useApplicationExceptionContext } from "../../contexts/ApplicationExceptionHandlerContext";
import { useEffect } from "react";
import CoverImage from "../../components/Resuables/CoverImage";
import { useStateManagersContext } from "../../contexts/StateManagersContext";
import AbstractDialog from "../../components/Resuables/AbstractDialog";
import FilterProductsDialogPanel from "./_ProductsPage/FilterProductsDialogPanel";
import DeleteProductDialogPanel from "./_ProductsPage/DeleteProductDialogPanel";
import AbstractTooltip, {
    AbstractTooltipDefaultPanel,
    AbstractTooltipTrigger,
} from "../../components/Resuables/AbstractTooltip";
import { useAbstractTooltipContext } from "../../contexts/AbstractTooltipContext";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../components/Resuables/MixinPrototypeCard";

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
                <AbstractDialog
                    Trigger={({ open, onToggle }) => (
                        <MixinButton
                            className="justify-center w-full rounded shadow basis-1/2"
                            options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                            active={open}
                            onClick={onToggle}
                        >
                            Filter
                        </MixinButton>
                    )}
                    Panel={<FilterProductsDialogPanel />}
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
        <div className="mixin-Pcard-like mixin-Pcard-base theme-Pcard-generic-white rounded shadow">
            <section className="grid grid-cols-2 h-32 w-full gap-1" data-role="section">
                <CoverImage
                    className="row-span-1 col-span-1 border border-gray-400 rounded shadow overflow-hidden"
                    src={productImages[0] == null ? undefined : productImages[0]}
                />
                <div className="row-span-1 col-span-1 gap-1 grid grid-cols-2 grid-rows-2">
                    {Array.from({ length: 4 }, (_, i) => i + 1).map((i) => (
                        <CoverImage
                            className="row-span-1 col-span-1 relative border border-gray-400"
                            src={productImages[i] == null ? undefined : productImages[i]}
                            key={i}
                        />
                    ))}
                </div>
            </section>
            <main className="flex flex-col gap-1" data-role="section">
                <div className="font-bold text-sm">{product.name}</div>
                <div className="p-0.5 px-2 bg-gray-900 text-white font-bold rounded shadow w-fit text-sm">
                    ${product.price}
                </div>
                <div className="flex flex-row gap-2 items-center text-xs ">
                    <div>Date Created:</div>
                    <div>{product.dateCreated.toLocaleDateString("en-us")}</div>
                </div>
            </main>
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
        </div>
    );
}

function ProductOptionMenu(props: { product: IProduct }) {
    const { product } = props;
    const { productStateManager } = useStateManagersContext();
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
                    <AbstractDialog
                        Trigger={({ open, onToggle }) => (
                            <MixinButton
                                className="justify-center rounded shadow w-full"
                                type="button"
                                options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                                onClick={() => {
                                    onToggle();
                                }}
                                active={open}
                            >
                                Delete Product
                            </MixinButton>
                        )}
                        Panel={<DeleteProductDialogPanel product={product} />}
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
