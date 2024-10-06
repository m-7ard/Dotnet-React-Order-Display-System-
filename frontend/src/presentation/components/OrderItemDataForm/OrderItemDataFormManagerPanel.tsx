import { useMutation } from "@tanstack/react-query";
import IProduct from "../../../domain/models/IProduct";
import useItemManager from "../../hooks/useItemManager";
import MixinButton from "../Resuables/MixinButton";
import { useApplicationExceptionContext } from "../../contexts/ApplicationExceptionHandlerContext";
import { useCommandDispatcherContext } from "../../contexts/CommandDispatcherContext";
import ListProductsCommand from "../../../application/commands/products/listProducts/ListProductsCommand";
import CoverImage from "../Resuables/CoverImage";
import { useState } from "react";
import { useGlobalDialogPanelContext } from "../Dialog/GlobalDialogPanelContext";
import LinkBox from "../Resuables/LinkBox";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../Resuables/MixinPrototypeCard";
import FilterProductsFieldset, { FilterProductsFieldsetValueState } from "../Fieldsets/FilterProductFieldset";
import parseListProductsCommandParameters from "../../../application/commands/products/listProducts/parseListProductsCommandParameters";
import { getApiUrl } from "../../../viteUtils";
import MixinPanel from "../Resuables/MixinPanel";

export type OrderItemDataFormManagerPanelProps = {
    existingProducts: {
        [productId: string]: {
            product: IProduct;
            count: number;
        };
    };
    onAdd: (product: IProduct) => void;
};

const initialValueState: FilterProductsFieldsetValueState = {
    id: "",
    name: "",
    minPrice: "",
    maxPrice: "",
    description: "",
    createdAfter: "",
    createdBefore: "",
};

export default function OrderItemDataFormManagerPanel(props: OrderItemDataFormManagerPanelProps) {
    const { existingProducts, onAdd } = props;
    const { dispatchException } = useApplicationExceptionContext();
    const { commandDispatcher } = useCommandDispatcherContext();
    const { onClose } = useGlobalDialogPanelContext();

    const [route, setRoute] = useState<"form" | "result">("form");
    const itemManager = useItemManager<FilterProductsFieldsetValueState>(initialValueState);

    const searchProductsMutation = useMutation({
        mutationKey: ["products"],
        gcTime: 1000 * 60,
        mutationFn: async (variables: FilterProductsFieldsetValueState) => {
            const parsedParams = parseListProductsCommandParameters(variables);
            const command = new ListProductsCommand(parsedParams);
            const result = await commandDispatcher.dispatch(command);

            if (result.isOk()) {
                setRoute("result");
                return result.value.products;
            } else if (result.error.type === "Exception") {
                dispatchException(result.error.data);
            }
        },
    });

    const searchResults = searchProductsMutation.data ?? [];

    return (
        <MixinPanel
            options={{
                size: "mixin-panel-base",
                theme: "theme-panel-generic-white",
            }}
            className="overflow-auto"
        >
            <header className="flex flex-row gap-2 items-center justify-between">
                <LinkBox
                    parts={[
                        { isLink: false, label: "Products" },
                        { isLink: false, label: "Filter" },
                    ]}
                />
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
                    className=" "
                >
                    Close
                </MixinButton>
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <nav className="flex flex-row gap-2">
                <MixinButton
                    options={{
                        size: "mixin-button-base",
                        theme: "theme-button-generic-white",
                    }}
                    type="button"
                    onClick={() => setRoute("form")}
                    active={route === "form"}
                    className="basis-1/2 justify-center"
                >
                    Form
                </MixinButton>
                <MixinButton
                    options={{
                        size: "mixin-button-base",
                        theme: "theme-button-generic-white",
                    }}
                    type="button"
                    onClick={() => setRoute("result")}
                    active={route === "result"}
                    className="basis-1/2 justify-center"
                >
                    Results
                </MixinButton>
            </nav>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            {
                {
                    form: (
                        <form
                            className="flex flex-col gap-[inherit]"
                            onReset={(e) => {
                                e.preventDefault();
                                itemManager.setAll(initialValueState);
                            }}
                            onSubmit={(e) => {
                                e.preventDefault();
                                searchProductsMutation.mutate(itemManager.items);
                            }}
                        >
                            <div className="flex flex-col gap-2">
                                <FilterProductsFieldset
                                    data={itemManager.items}
                                    onChange={(field, value) => itemManager.updateItem(field, value)}
                                />
                            </div>
                            <footer className="flex flex-row gap-2 justify-end shrink-0">
                                <MixinButton
                                    className="  overflow-hidden"
                                    options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                                    type="reset"
                                >
                                    Reset
                                </MixinButton>
                                <MixinButton
                                    className="  overflow-hidden"
                                    options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }}
                                    type="submit"
                                >
                                    Submit
                                </MixinButton>
                            </footer>
                        </form>
                    ),
                    result: (
                        <section className="flex flex-col sm:grid sm:grid-cols-2 gap-x-2 gap-y-4 grow">
                            {searchResults.map((product) => (
                                <Product
                                    key={product.id}
                                    product={product}
                                    count={existingProducts[product.id.toString()]?.count ?? 0}
                                    onAdd={() => onAdd(product)}
                                />
                            ))}
                        </section>
                    ),
                }[route]
            }
        </MixinPanel>
    );
}

function Product(props: { product: IProduct; count: number; onAdd: () => void }) {
    const { product, count, onAdd } = props;
    const productImages = product.images;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
                <CoverImage
                    className="h-16 aspect-square border border-gray-900 overflow-hidden"
                    src={productImages[0] == null ? undefined : `${getApiUrl()}/${productImages[0].url}`}
                />
                <div className="flex flex-col gap-px">
                    <div className="text-sm font-bold truncate">{product.name}</div>
                    <div className="text-sm">${product.price}</div>
                    <div className="mt-auto text-xs">{product.dateCreated.toLocaleString("en-us")}</div>
                </div>
            </div>
            <footer className="flex flex-row gap-2">
                <div className="mixin-button-like mixin-button-base bg-gray-200 border border-gray-900">x{count}</div>
                <MixinButton
                    className="grow justify-center  "
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }}
                    onClick={onAdd}
                >
                    Add Item
                </MixinButton>
            </footer>
        </div>
    );
}
