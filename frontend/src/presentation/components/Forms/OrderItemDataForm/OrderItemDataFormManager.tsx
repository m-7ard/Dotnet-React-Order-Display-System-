import IFormError from "../../../../domain/models/IFormError";
import MixinButton from "../../Resuables/MixinButton";
import IProduct from "../../../../domain/models/IProduct";
import AbstractDialog from "../../Resuables/AbstractDialog";
import OrderItemDataFormManagerPanel, { OrderItemDataFormManagerPanelProps } from "./OrderItemDataFormManagerPanel";
import useItemManager from "../../../hooks/useItemManager";
import OrderItemDataForm, { IOrderItemDataFormError, IOrderItemDataFormValue } from "./OrderItemDataForm";

type OrderItemDataFormManagerError = IFormError<{
    [UID: string]: IOrderItemDataFormError;
}>;

export default function OrderItemDataFormManager(props: {
    onDelete: (UID: string) => void;
    onUpdate: (UID: string, value: IOrderItemDataFormValue) => void;
    onAdd: (product: IProduct) => void;
    errors?: OrderItemDataFormManagerError;
    value: {
        [UID: string]: IOrderItemDataFormValue;
    };
}) {
    const { onDelete, onUpdate, onAdd, errors, value } = props;

    const itemManager = useItemManager<{ [productId: string]: IProduct }>({});
    const searchPanelProducts = Object.values(value).reduce<OrderItemDataFormManagerPanelProps["existingProducts"]>(
        (acc, curr) => {
            if (acc[curr.productId] == null) {
                acc[curr.productId] = {
                    product: itemManager.items[curr.productId],
                    count: 1,
                };
            } else {
                acc[curr.productId].count += 1;
            }

            return acc;
        },
        {},
    );

    return (
        <div className="p-2 flex flex-col gap-1 bg-gray-200 border border-gray-400">
            <AbstractDialog
                Trigger={({ onToggle }) => (
                    <MixinButton
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-white",
                        }}
                        className="justify-center"
                        onClick={onToggle}
                        type="button"
                    >
                        Add
                    </MixinButton>
                )}
                Panel={
                    <OrderItemDataFormManagerPanel
                        existingProducts={searchPanelProducts}
                        onAdd={(product) => {
                            itemManager.addItem(product.id.toString(), product);
                            onAdd(product);
                        }}
                    />
                }
            />
            {Object.entries(value).map(([UID, orderItem]) => (
                <OrderItemDataForm
                    product={itemManager.items[orderItem.productId]}
                    errors={errors?.[UID]}
                    value={value[UID]}
                    onUpdate={(fieldName, fieldValue) => {
                        const newValue = { ...value[UID] };
                        newValue[fieldName] = fieldValue;
                        onUpdate(UID, newValue);
                    }}
                    onDelete={() => {
                        itemManager.deleteItem(UID);
                        onDelete(UID);
                    }}
                />
            ))}
        </div>
    );
}
