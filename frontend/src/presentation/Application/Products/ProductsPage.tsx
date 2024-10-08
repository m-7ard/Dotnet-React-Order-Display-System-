import { Link, useLoaderData, useNavigate, useParams, useSearch } from "@tanstack/react-router";
import IProduct from "../../../domain/models/IProduct";
import MixinButton from "../../components/Resuables/MixinButton";
import { useApplicationExceptionContext } from "../../contexts/ApplicationExceptionHandlerContext";
import { useCallback, useEffect, useState } from "react";
import CoverImage from "../../components/Resuables/CoverImage";
import { useStateManagersContext } from "../../contexts/StateManagersContext";
import FilterProductsDialogPanel from "./_ProductsPage/FilterProductsDialogPanel";
import DeleteProductDialogPanel from "./_ProductsPage/DeleteProductDialogPanel";
import AbstractTooltip, {
    AbstractTooltipDefaultPanel,
    AbstractTooltipTrigger,
} from "../../components/Resuables/AbstractTooltip";
import { useAbstractTooltipContext } from "../../contexts/AbstractTooltipContext";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import LinkBox from "../../components/Resuables/LinkBox";
import { getApiUrl } from "../../../viteUtils";
import MixinPanel from "../../components/Resuables/MixinPanel";
import routeData from "../../routes/_routeData";
import StatelessRadioCheckboxField from "../../components/StatelessFields/StatelessRadioCheckboxField";
import IListProductsRequestDTO from "../../../application/contracts/products/list/IListProductsRequestDTO";

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
        <div className="mixin-page-like mixin-page-base mx-auto">
            <header className="flex flex-row gap-2 items-center shrink-0 overflow-x-auto">
                <LinkBox parts={[{ isLink: true, to: routeData.createProduct.build({}), label: "Products" }]} />
                <div className="flex flex-row gap-2 ml-auto">
                    <Link to="/products/create">
                        <MixinButton
                            className="justify-center w-full  "
                            options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                        >
                            Create
                        </MixinButton>
                    </Link>
                    <GlobalDialog
                        zIndex={10}
                        Trigger={({ onToggle }) => (
                            <MixinButton
                                className="justify-center w-full   basis-1/2"
                                options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                onClick={onToggle}
                            >
                                Filter
                            </MixinButton>
                        )}
                        Panel={FilterProductsDialogPanel}
                        panelProps={{}}
                    />
                    <AbstractTooltip
                        Trigger={({ onToggle }) => (
                            <AbstractTooltipTrigger>
                                <MixinButton
                                    className="w-full truncate"
                                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                    onClick={onToggle}
                                >
                                    Order By
                                </MixinButton>
                            </AbstractTooltipTrigger>
                        )}
                        Panel={<OrderByMenu />}
                        positioning={{ top: "100%", right: "0px" }}
                    />
                </div>
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <section className="grid grid-cols-4 max-[576px]:grid-cols-3 max-[425px]:grid-cols-2 gap-x-2 gap-y-4">
                {products.map((product) => (
                    <Product product={product} key={product.id} />
                ))}
            </section>
        </div>
    );
}

function Product(props: { product: IProduct }) {
    const { product } = props;
    const productImages = product.images.map((image) => `${getApiUrl()}/Media/${image.fileName}`);
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-2">
            <CoverImage
                className="w-full aspect-square border border-gray-900   overflow-hidden"
                src={productImages[0] == null ? undefined : productImages[0]}
            />
            <div className="flex flex-col gap-px">
                <div className="text-sm font-bold truncate">{product.name}</div>
                <div className="text-sm">${product.price}</div>
                <div className="mt-auto text-xs">{product.dateCreated.toLocaleString("en-us")}</div>
            </div>
            <footer className="flex flex-col gap-2 bg-gray-100" data-role="section">
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

function ProductOptionMenu(props: { product: IProduct }) {
    const { product } = props;
    const { productStateManager } = useStateManagersContext();
    const { onClose } = useAbstractTooltipContext();
    const navigate = useNavigate();

    return (
        <AbstractTooltipDefaultPanel className={`z-10 fixed mt-1`}>
            <MixinPanel
                options={{
                    size: "mixin-panel-base",
                    theme: "theme-panel-generic-white",
                }}
            >
                <header className="flex flex-row items-center justify-between">
                    <div className="text-sm">Other Options</div>
                    <MixinButton
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-white",
                        }}
                        onClick={onClose}
                        className=" "
                        type="button"
                    >
                        Close
                    </MixinButton>
                </header>
                <hr className="h-0 w-full border-bottom border-gray-900"></hr>
                <div className="flex flex-col gap-2">
                    <a
                        className="w-full"
                        onClick={(e) => {
                            e.preventDefault();
                            productStateManager.setProduct(product);
                            navigate({ to: `/products/${product.id}/update` });
                        }}
                    >
                        <MixinButton
                            className="justify-center truncate w-full"
                            type="button"
                            options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }}
                        >
                            Update Product
                        </MixinButton>
                    </a>
                    <GlobalDialog
                        zIndex={20}
                        Trigger={({ onToggle }) => (
                            <MixinButton
                                className="justify-center w-full"
                                type="button"
                                options={{ size: "mixin-button-base", theme: "theme-button-generic-red" }}
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
                    <a
                        className="w-full truncate"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate({ to: "/product_histories", search: { productId: product.id } });
                        }}
                    >
                        <MixinButton
                            className="justify-center w-full"
                            type="button"
                            options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }}
                        >
                            See Product History
                        </MixinButton>
                    </a>
                </div>
            </MixinPanel>
        </AbstractTooltipDefaultPanel>
    );
}

function OrderByMenu() {
    const { onClose } = useAbstractTooltipContext();
    const navigate = useNavigate();
    const searchParams: Record<keyof IListProductsRequestDTO, string> = useSearch({ strict: false });

    const orderBy = searchParams.orderBy;
    const onChange = useCallback(
        (value: string) => {
            navigate({ to: routeData.listProducts.pattern, search: { ...searchParams, orderBy: value } });
            onClose();
        },
        [navigate, searchParams, onClose],
    );

    return (
        <AbstractTooltipDefaultPanel className={`z-10 fixed mt-1`}>
            <MixinPanel
                options={{
                    size: "mixin-panel-base",
                    theme: "theme-panel-generic-white",
                }}
            >
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <div className="text-sm">Newest</div>
                        <StatelessRadioCheckboxField
                            name={"orderBy"}
                            onChange={onChange}
                            value={"newest"}
                            checked={orderBy === "newest"}
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <div className="text-sm">Oldest</div>
                        <StatelessRadioCheckboxField
                            name={"orderBy"}
                            onChange={onChange}
                            value={"oldest"}
                            checked={orderBy === "oldest"}
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <div className="text-sm">Price - Lowest to Highest</div>
                        <StatelessRadioCheckboxField
                            name={"orderBy"}
                            onChange={onChange}
                            value={"price asc"}
                            checked={orderBy === "price asc"}
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <div className="text-sm">Price - Highest to Lowest</div>
                        <StatelessRadioCheckboxField
                            name={"orderBy"}
                            onChange={onChange}
                            value={"price desc"}
                            checked={orderBy === "price desc"}
                        />
                    </div>
                </div>
            </MixinPanel>
        </AbstractTooltipDefaultPanel>
    );
}
