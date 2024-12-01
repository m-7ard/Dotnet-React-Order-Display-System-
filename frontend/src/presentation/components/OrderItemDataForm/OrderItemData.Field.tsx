import IPresentationError from "../../../domain/models/IFormError";
import MixinButton from "../Resuables/MixinButton";
import FilterProductsPanel from "./FilterProducts.Panel";
import OrderItemDataFieldItem, { ErrorSchema as OrderItemDataFieldErrorSchema, ValueSchema as OrderItemDataValueSchema } from "./OrderItemData.Field.Item";
import GlobalDialog from "../Dialog/GlobalDialog";
import IProduct from "../../../domain/models/IProduct";
import { useCallback } from "react";

type ErrorSchema = IPresentationError<{
    [productId: number | string]: OrderItemDataFieldErrorSchema;
}>;

type ValueSchema = {
    [productId: number | string]: OrderItemDataValueSchema;
};

export default function OrderItemDataField(props: {
    onChange: (value: ValueSchema) => void;
    errors?: ErrorSchema;
    value: ValueSchema;
}) {
    const { errors, value, onChange } = props;

    const deleteOrderItem = useCallback(
        (productId: number | string) => {
            const newValue = { ...value };
            delete newValue[productId];
            onChange(newValue);
        },
        [onChange, value],
    );

    const addOrderItem = useCallback(
        (product: IProduct) => {
            const newValue = { ...value };
            newValue[product.id] = {
                product: product,
                quantity: 1,
            };
            onChange(newValue);
        },
        [onChange, value],
    );

    const updateOrderItem = useCallback(
        (orderItemData: OrderItemDataValueSchema) => {
            const newValue = { ...value };
            newValue[orderItemData.product.id] = orderItemData;
            onChange(newValue);
        },
        [onChange, value],
    );

    return (
        <div className="flex flex-col gap-2">
            <GlobalDialog
                zIndex={10}
                Trigger={({ onToggle }) => (
                    <MixinButton
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-white",
                        }}
                        className="w-full justify-center "
                        onClick={onToggle}
                        type="button"
                    >
                        Add
                    </MixinButton>
                )}
                Panel={FilterProductsPanel}
                panelProps={{
                    onAdd: addOrderItem,
                    orderItems: value,
                }}
            />
            <div className="grid grid-cols-2 max-[425px]:grid-cols-1 gap-x-2 gap-y-4">
                {Object.entries(value).map(([productId, oiData]) => (
                    <OrderItemDataFieldItem product={oiData.product} errors={errors?.[productId]} value={value[productId]} onUpdate={updateOrderItem} onDelete={() => deleteOrderItem(productId)} key={productId} />
                ))}
            </div>
        </div>
    );
}
