import { useMutation } from "@tanstack/react-query";
import IProduct from "../../../../domain/models/IProduct";
import { useAbstractDialogContext } from "../../../contexts/AbstractDialogContext";
import useItemManager from "../../../hooks/useItemManager";
import { AbstractDialogPanel } from "../../Resuables/AbstractDialog";
import MixinButton from "../../Resuables/MixinButton";
import StatelessCharField from "../../StatelessFields/StatelessCharField";
import FormField from "../FormField";
import { useApplicationExceptionContext } from "../../../contexts/ApplicationExceptionHandlerContext";
import { useCommandDispatcherContext } from "../../../contexts/CommandDispatcherContext";
import ListProductsCommand from "../../../../application/commands/products/listProducts/ListProductsCommand";
import CoverImage from "../../Resuables/CoverImage";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

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
};

const initialValueState: ValueState = {
    id: "",
    name: "",
    minPrice: "",
    maxPrice: "",
};

export default function OrderItemDataFormManagerPanel(props: OrderItemDataFormManagerPanelProps) {
    const { dispatchException } = useApplicationExceptionContext();
    const { commandDispatcher } = useCommandDispatcherContext();

    const { existingProducts, onAdd } = props;

    const { onClose } = useAbstractDialogContext();
    const itemManager = useItemManager<ValueState>(initialValueState);

    const searchProductsMutation = useMutation({
        mutationKey: ["products"],
        gcTime: 1000 * 60,
        mutationFn: async (variables: ValueState) => {
            const command = new ListProductsCommand({
                minPrice: Value.Check(Type.Number({ minimum: 0 }), parseFloat(variables.minPrice))
                    ? parseFloat(variables.minPrice)
                    : null,
                maxPrice: Value.Check(Type.Number({ minimum: 0 }), parseFloat(variables.maxPrice))
                    ? parseFloat(variables.maxPrice)
                    : null,
                name: variables.name,
                createdAfter: null,
                createdBefore: null,
                description: null,
            });
            const result = await commandDispatcher.dispatch(command);

            if (result.isOk()) {
                return result.value.products;
            } else if (result.error.type === "Exception") {
                dispatchException(result.error.data);
            }
        },
    });

    const searchResults = searchProductsMutation.data ?? [];

    return (
        <AbstractDialogPanel className="mixin-page-like mixin-page-base bg-gray-100 border border-gray-900 m-4 max-w-80">
            <header className="flex flex-row justify-between items-center">
                <div className="text-base text-gray-900">Add Products</div>
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
                >
                    Close
                </MixinButton>
            </header>
            <hr className="h-0 w-full border-bottom border-dashed border-gray-800"></hr>
            <section className="flex flex-col gap-2">
                <FormField name="name">
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-sm",
                            theme: "theme-input-generic-white",
                        }}
                        value={itemManager.items.name}
                        onChange={(value) => itemManager.updateItem("name", value)}
                    />
                </FormField>
                <div className="flex flex-row gap-2">
                    <div className="basis-1/2">
                        <FormField name="minPrice">
                            <StatelessCharField
                                options={{
                                    size: "mixin-char-input-sm",
                                    theme: "theme-input-generic-white",
                                }}
                                value={itemManager.items.minPrice}
                                onChange={(value) => itemManager.updateItem("minPrice", value)}
                            />
                        </FormField>
                    </div>
                    <div className="basis-1/2">
                        <FormField name="maxPrice">
                            <StatelessCharField
                                options={{
                                    size: "mixin-char-input-sm",
                                    theme: "theme-input-generic-white",
                                }}
                                value={itemManager.items.maxPrice}
                                onChange={(value) => itemManager.updateItem("maxPrice", value)}
                            />
                        </FormField>
                    </div>
                </div>
                <div className="flex flex-row gap-2 justify-end">
                    <MixinButton
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-white",
                        }}
                        className="justify-cetner"
                        onClick={() => itemManager.setAll(initialValueState)}
                    >
                        Reset
                    </MixinButton>
                    <MixinButton
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-green",
                        }}
                        className="justify-cetner"
                        type="button"
                        onClick={() => searchProductsMutation.mutate(itemManager.items)}
                    >
                        Search
                    </MixinButton>
                </div>
            </section>
            <hr className="h-0 w-full border-bottom border-dashed border-gray-800"></hr>
            <footer className="flex flex-col gap-1">
                <header className="flex flex-row justify-between">
                    <div className="text-sm text-gray-900">Results</div>
                </header>
                {searchResults.map((product) => (
                    <Product
                        key={product.id}
                        product={product}
                        existingProducts={existingProducts}
                        onAdd={() => onAdd(product)}
                    />
                ))}
            </footer>
        </AbstractDialogPanel>
    );
}

function Product(props: {
    product: IProduct;
    existingProducts: OrderItemDataFormManagerPanelProps["existingProducts"];
    onAdd: () => void;
}) {
    const { product, existingProducts, onAdd } = props;
    const active = existingProducts[product.id.toString()] != null;

    return (
        <div className={`flex flex-row gap-1 p-1 border border-gray-400 ${active ? "bg-gray-300" : "bg-gray-200"}`}>
            <div className="w-32 h-32 grid grid-cols-2 grid-rows-2 gap-0.5 shrink-0">
                {Array.from({ length: 4 }).map((_, i) => (
                    <CoverImage
                        className="row-span-1 col-span-1 border border-gray-400"
                        src={product.images[i] == null ? undefined : `${import.meta.env.VITE_API_URL}/Media/${product.images[i]?.fileName}`}
                    />
                ))}
            </div>
            <div className="flex flex-col gap-1 grow overflow-hidden">
                <div className="p-1 overflow-hidden">
                    <div className="text-xs text-gray-600 leading-none">#{product.id}</div>
                    <div className="text-base font-medium leading-none truncate">{product.name}</div>
                </div>
                <div className="flex flex-row border border-gray-400 text-sm mt-auto">
                    <div className="px-2 bg-gray-300 text-gray-900">Item Count</div>
                    <div className="px-2 border-l border-gray-400 flex grow justify-end bg-gray-100 justify-center">
                        {!active ? 0 : existingProducts[product.id.toString()].count}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <MixinButton
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-yellow",
                        }}
                        className={`justify-center`}
                        onClick={onAdd}
                    >
                        Add
                    </MixinButton>
                </div>
            </div>
        </div>
    );
}
