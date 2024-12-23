import IPresentationError from "../../interfaces/IPresentationError";
import MixinButton from "../Resuables/MixinButton";
import FilterProductsPanel from "./FilterProducts.Panel";
import OrderItemDataFieldItem, { ErrorSchema as OrderItemDataFieldErrorSchema, ValueSchema as OrderItemDataValueSchema } from "./OrderItemData.Field.Item";
import GlobalDialog from "../Dialog/GlobalDialog";
import IProduct from "../../../domain/models/IProduct";
import { useCallback } from "react";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../Resuables/MixinPrototypeCard";

type ErrorSchema = IPresentationError<{
    [productId: number | string]: OrderItemDataFieldErrorSchema;
}>;

type ValueSchema = {
    [productId: number | string]: OrderItemDataValueSchema;
};

export default function OrderItemDataField(props: { onChange: (value: ValueSchema) => void; errors?: ErrorSchema; value: ValueSchema }) {
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
        <MixinPrototypeCard
            options={{
                size: "mixin-Pcard-base",
                theme: "theme-Pcard-generic-white",
            }}
            hasBorder
            hasDivide
        >
            <MixinPrototypeCardSection>
                <GlobalDialog
                    zIndex={10}
                    Trigger={({ onToggle }) => (
                        <MixinButton
                            options={{
                                size: "mixin-button-base",
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
            </MixinPrototypeCardSection>
            {Object.entries(value).length > 0 && (
                <MixinPrototypeCardSection className="grid grid-cols-2 max-[576px]:grid-cols-2 max-[445px]:grid-cols-1 gap-3">
                    {Object.entries(value).map(([productId, oiData]) => (
                        <OrderItemDataFieldItem product={oiData.product} errors={errors?.[productId]} value={value[productId]} onUpdate={updateOrderItem} onDelete={() => deleteOrderItem(productId)} key={productId} />
                    ))}
                </MixinPrototypeCardSection>
            )}
        </MixinPrototypeCard>
    );
}
