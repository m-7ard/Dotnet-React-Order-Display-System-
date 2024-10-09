import { Link, useLoaderData } from "@tanstack/react-router";
import MixinButton from "../../components/Resuables/MixinButton";
import { useApplicationExceptionContext } from "../../contexts/ApplicationExceptionHandlerContext";
import { useEffect } from "react";
import FilterProductsDialogPanel from "./_ProductsPage/FilterProductsDialogPanel";
import AbstractTooltip, {
    AbstractTooltipTrigger,
} from "../../components/Resuables/AbstractTooltip";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import LinkBox from "../../components/Resuables/LinkBox";
import routeData from "../../routes/_routeData";
import Product from "./ProductsPage.Product";
import OrderByMenu from "./ProductsPage.OrderByMenu";

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
