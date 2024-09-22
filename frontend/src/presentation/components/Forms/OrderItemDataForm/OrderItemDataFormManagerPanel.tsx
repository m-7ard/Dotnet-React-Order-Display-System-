import { useMutation } from "@tanstack/react-query";
import IProduct from "../../../../domain/models/IProduct";
import { useAbstractDialogContext } from "../../../contexts/AbstractDialogContext";
import useItemManager from "../../../hooks/useItemManager";
import MixinButton from "../../Resuables/MixinButton";
import StatelessCharField from "../../StatelessFields/StatelessCharField";
import FormField from "../FormField";
import { useApplicationExceptionContext } from "../../../contexts/ApplicationExceptionHandlerContext";
import { useCommandDispatcherContext } from "../../../contexts/CommandDispatcherContext";
import ListProductsCommand from "../../../../application/commands/products/listProducts/ListProductsCommand";
import CoverImage from "../../Resuables/CoverImage";
import StatelessTextArea from "../../StatelessFields/StatelessTextArea";
import { useState } from "react";
import { parseListProductsSchema } from "../../../schemas/listProductsSchema";

export type OrderItemDataFormManagerPanelProps = {
    existingProducts: {
        [productId: string]: {
            product: IProduct;
            count: number;
        };
    };
    onAdd: (product: IProduct) => void;
};

type ValueState = {
    id: string;
    name: string;
    minPrice: string;
    maxPrice: string;
    description: string;
    createdAfter: string;
    createdBefore: string;
};

const initialValueState: ValueState = {
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
    const { onClose } = useAbstractDialogContext();

    const [route, setRoute] = useState<"form" | "result">("form");
    const itemManager = useItemManager<ValueState>(initialValueState);

    const searchProductsMutation = useMutation({
        mutationKey: ["products"],
        gcTime: 1000 * 60,
        mutationFn: async (variables: ValueState) => {
            const parsedParams = parseListProductsSchema(variables);
            const command = new ListProductsCommand({
                id: parsedParams.id,
                minPrice: parsedParams.minPrice,
                maxPrice: parsedParams.maxPrice,
                name: parsedParams.name,
                createdAfter: parsedParams.createdAfter,
                createdBefore: parsedParams.createdBefore,
                description: parsedParams.description,
            });
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
            <header className="flex flex-row justify-between items-center">
                <div className="text-xl text-gray-900 font-bold">Filter Orders</div>
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
                    className="rounded shadow"
                >
                    Close
                </MixinButton>
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <nav className="flex flex-row gap-4">
                <MixinButton
                    options={{
                        size: "mixin-button-base",
                        theme: route === "form" ? "theme-button-generic-yellow" : "theme-button-generic-white",
                    }}
                    type="button"
                    onClick={() => setRoute("form")}
                    className="basis-1/2 justify-center"
                >
                    Form
                </MixinButton>
                <MixinButton
                    options={{
                        size: "mixin-button-base",
                        theme: route === "result" ? "theme-button-generic-yellow" : "theme-button-generic-white",
                    }}
                    type="button"
                    onClick={() => setRoute("result")}
                    className="basis-1/2 justify-center"
                >
                    Results
                </MixinButton>
            </nav>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            {
                {
                    form: (
                        <FilterProductsForm
                            data={itemManager.items}
                            onChange={(field, value) => itemManager.updateItem(field, value)}
                            onSubmit={() => searchProductsMutation.mutate(itemManager.items)}
                            onReset={() => itemManager.setAll(initialValueState)}
                        />
                    ),
                    result: (
                        <section className="flex flex-col gap-2 grow overflow-hidden">
                            <header className="flex flex-row justify-between items-baseline">
                                <div className="text-base text-gray-900 font-bold">Results</div>
                                <div className="text-sm text-gray-900">Count {searchResults.length}</div>
                            </header>
                            <div className="flex flex-col gap-4 overflow-scroll">
                                {searchResults.map((product) => (
                                    <Product
                                        key={product.id}
                                        product={product}
                                        count={existingProducts[product.id.toString()]?.count ?? 0}
                                        onAdd={() => onAdd(product)}
                                    />
                                ))}
                            </div>
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
        <output className="bg-white divide-y divide-gray-300 rounded shadow border-gray-300 border">
            <div className="flex flex-col gap-2 p-2 px-4">
                <div className="w-full grid grid-cols-4 grid-rows-1 shrink-0 gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <CoverImage
                            className="row-span-1 col-span-1 aspect-square border border-gray-300 rounded shadow overflow-hidden"
                            src={
                                product.images[i]?.fileName == null
                                    ? undefined
                                    : `${import.meta.env.VITE_API_URL}/Media/${product.images[i].fileName}`
                            }
                            key={i}
                        />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-2 p-2 px-4">
                <div className="flex flex-col gap-1 grow">
                    <div>
                        <div className="text-sm font-semibold">{product.name}</div>
                        <div className="text-sm">{`${product.price}`}</div>
                    </div>
                </div>
                <div className="flex flex-row gap-2 items-center text-sm">
                    <div>Item Count</div>
                    <div className="p-0.5 px-2 bg-gray-900 text-white font-bold rounded shadow">{count}</div>
                </div>
            </div>
            <div className="flex flex-row gap-1 mt-auto p-2 px-4">
                <MixinButton
                    className="basis-1/2 justify-center rounded shadow"
                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-yellow" }}
                    onClick={onAdd}
                >
                    Add Item
                </MixinButton>
            </div>
        </output>
    );
}

function FilterProductsForm(props: {
    data: ValueState;
    onChange: (field: keyof ValueState, value: ValueState[keyof ValueState]) => void;
    onSubmit: () => void;
    onReset: () => void;
}) {
    const { data, onChange, onSubmit, onReset } = props;

    return (
        <>
            <section className="flex flex-col gap-2 overflow-auto">
                <FormField name="name">
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={data.name}
                        onChange={(value) => onChange("name", value)}
                    />
                </FormField>
                <div className="flex flex-row gap-2">
                    <div className="basis-1/2">
                        <FormField name="minPrice">
                            <StatelessCharField
                                options={{
                                    size: "mixin-char-input-base",
                                    theme: "theme-input-generic-white",
                                }}
                                value={data.minPrice}
                                onChange={(value) => onChange("minPrice", value)}
                            />
                        </FormField>
                    </div>
                    <div className="basis-1/2">
                        <FormField name="maxPrice">
                            <StatelessCharField
                                options={{
                                    size: "mixin-char-input-base",
                                    theme: "theme-input-generic-white",
                                }}
                                value={data.maxPrice}
                                onChange={(value) => onChange("maxPrice", value)}
                            />
                        </FormField>
                    </div>
                </div>
                <FormField name="description">
                    <StatelessTextArea
                        onChange={(value) => onChange("description", value)}
                        value={data.description}
                        options={{
                            size: "mixin-textarea-any",
                            theme: "theme-textarea-generic-white",
                        }}
                        rows={5}
                        maxLength={1028}
                    />
                </FormField>
                <FormField name="createdBefore">
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={data.createdBefore}
                        type="date"
                        onChange={(value) => onChange("createdBefore", value)}
                    />
                </FormField>
                <FormField name="createdAfter">
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={data.createdAfter}
                        type="date"
                        onChange={(value) => onChange("createdAfter", value)}
                    />
                </FormField>
            </section>
            <footer className="flex flex-row gap-2">
                <MixinButton
                    className="rounded shadow overflow-hidden basis-1/2 justify-center"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                    onClick={() => onReset()}
                    type="button"
                >
                    Reset
                </MixinButton>
                <MixinButton
                    className="rounded shadow overflow-hidden basis-1/2 justify-center"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }}
                    onClick={() => onSubmit()}
                    type="button"
                >
                    Submit
                </MixinButton>
            </footer>
        </>
    );
}
