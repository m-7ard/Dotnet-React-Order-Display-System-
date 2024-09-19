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
        <AbstractDialogPanel className="mixin-page-like mixin-page-base bg-gray-50 border border-gray-900 m-4 max-w-80">
            <header className="flex flex-row justify-between items-center">
                <div className="text-2xl text-gray-900 font-bold">Create Product</div>
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
            <section className="flex flex-col gap-2">
                <FormField name="name">
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
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
                                    size: "mixin-char-input-base",
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
                                    size: "mixin-char-input-base",
                                    theme: "theme-input-generic-white",
                                }}
                                value={itemManager.items.maxPrice}
                                onChange={(value) => itemManager.updateItem("maxPrice", value)}
                            />
                        </FormField>
                    </div>
                </div>
            </section>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <footer className="flex flex-row gap-2">
                <MixinButton
                    className="rounded shadow overflow-hidden basis-1/2 justify-center"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                    type="reset"
                    onClick={() => itemManager.setAll(initialValueState)}
                >
                    Reset
                </MixinButton>
                <MixinButton
                    className="rounded shadow overflow-hidden basis-1/2 justify-center"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }}
                    type="submit"
                    onClick={() => searchProductsMutation.mutate(itemManager.items)}
                >
                    Submit
                </MixinButton>
            </footer>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <footer className="flex flex-col gap-2 grow overflow-hidden">
                <header className="flex flex-row justify-between">
                    <div className="text-base text-gray-900 font-bold">Results</div>
                </header>
                <div className="flex flex-col gap-4 overflow-scroll">
                    {searchResults.map((product) => (
                        <Product
                            key={product.id}
                            product={product}
                            existingProducts={existingProducts}
                            onAdd={() => onAdd(product)}
                        />
                    ))}
                </div>

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
    const isCurrentlyAdded = existingProducts[product.id.toString()] != null;

    return (
        <div className="bg-white divide-y divide-gray-300 rounded shadow border-gray-300 border">
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
                    <div className="p-0.5 px-2 bg-gray-900 text-white font-bold rounded shadow">
                        {existingProducts[product.id.toString()]?.count ?? 0}
                    </div>
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
        </div>
    );
}
