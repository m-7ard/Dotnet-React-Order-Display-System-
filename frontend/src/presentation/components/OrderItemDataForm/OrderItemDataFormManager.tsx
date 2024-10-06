import IFormError from "../../../domain/models/IFormError";
import MixinButton from "../Resuables/MixinButton";
import IProduct from "../../../domain/models/IProduct";
import OrderItemDataFormManagerPanel, { OrderItemDataFormManagerPanelProps } from "./OrderItemDataFormManagerPanel";
import useItemManager from "../../hooks/useItemManager";
import OrderItemDataForm, { IOrderItemDataFormError, IOrderItemDataFormValue } from "./OrderItemDataForm";
import GlobalDialog from "../Dialog/GlobalDialog";

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
                Panel={OrderItemDataFormManagerPanel}
                panelProps={{
                    existingProducts: searchPanelProducts,
                    onAdd: (product) => {
                        itemManager.addItem(product.id.toString(), product);
                        onAdd(product);
                    },
                }}
            />
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2">
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
                        key={UID}
                    />
                ))}
            </div>
        </div>
    );
}
