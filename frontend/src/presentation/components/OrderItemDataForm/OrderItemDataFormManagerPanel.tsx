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
import Linkbox from "../Resuables/LinkBox";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../Resuables/MixinPrototypeCard";
import FilterProductsFieldset, { FilterProductsFieldsetValueState } from "../Fieldsets/FilterProductFieldset";
import parseListProductsCommandParameters from "../../../application/commands/products/listProducts/parseListProductsCommandParameters";

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
        <div className="mixin-panel-like mixin-panel-base theme-panel-generic-white max-w-80 max-h-[80vh]">
            <header className="flex flex-row gap-2 items-center justify-between">
                <Linkbox
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
            <nav className="flex flex-row divide-x divide-gray-900 border border-gray-900 text-sm overflow-hidden shrink-0">
                <button
                    type="button"
                    onClick={() => setRoute("form")}
                    className={`mixin-button-like basis-1/2 justify-center py-1 px-2 shrink-0 ${route === "form" ? "bg-gray-200 " : "bg-white hover:bg-gray-200"}`}
                >
                    Form
                </button>
                <button
                    type="button"
                    onClick={() => setRoute("result")}
                    className={`mixin-button-like basis-1/2 justify-center py-1 px-2 shrink-0 ${route === "result" ? "bg-gray-200 " : "bg-white hover:bg-gray-200"}`}
                >
                    Results
                </button>
            </nav>
            {
                {
                    form: (
                        <>
                            <fieldset className="flex flex-col gap-2 p-4 bg-gray-100 border border-gray-900">
                                <FilterProductsFieldset
                                    data={itemManager.items}
                                    onChange={(field, value) => itemManager.updateItem(field, value)}
                                />
                            </fieldset>
                            <footer className="flex flex-row gap-2">
                                <MixinButton
                                    className="  overflow-hidden basis-1/2 justify-center"
                                    options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                                    onClick={() => itemManager.setAll(initialValueState)}
                                    type="button"
                                >
                                    Reset
                                </MixinButton>
                                <MixinButton
                                    className="  overflow-hidden basis-1/2 justify-center"
                                    options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }}
                                    onClick={() => searchProductsMutation.mutate(itemManager.items)}
                                    type="button"
                                >
                                    Submit
                                </MixinButton>
                            </footer>
                        </>
                    ),
                    result: (
                        <section className="flex flex-col overflow-scroll gap-2 pr-4 pb-4 grow">
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
        </div>
    );
}

function Product(props: { product: IProduct; count: number; onAdd: () => void }) {
    const { product, count, onAdd } = props;

    return (
        <MixinPrototypeCard
            options={{
                size: "mixin-Pcard-base",
                theme: "theme-Pcard-generic-white",
            }}
        >
            <MixinPrototypeCardSection className="flex flex-row gap-2">
                <CoverImage
                    className="w-16 h-16 border border-gray-900  overflow-hidden"
                    src={
                        product.images[0] == null
                            ? undefined
                            : `${import.meta.env.VITE_API_URL}/Media/${product.images[0].fileName}`
                    }
                />
                <div className="flex flex-col gap-1 grow">
                    <div className="text-sm font-bold">{product.name}</div>
                    <div className="text-sm">${product.price}</div>
                    <div className="mt-auto text-xs">{product.dateCreated.toLocaleString("en-us")}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-row gap-1 justify-between bg-gray-100">
                <div className="flex flex-row gap-2 items-center text-sm px-2 py-px bg-gray-200  border border-gray-900">
                    x{count}
                </div>
                <MixinButton
                    className="basis-1/2 justify-center  "
                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-yellow" }}
                    onClick={onAdd}
                >
                    Add Item
                </MixinButton>
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
