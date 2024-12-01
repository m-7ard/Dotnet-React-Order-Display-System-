import { useNavigate, useSearch } from "@tanstack/react-router";
import { useGlobalDialogPanelContext } from "../../../components/Dialog/GlobalDialog.Panel.Context";
import { FilterOrdersFieldsetValueState } from "../../../components/Fieldsets/FilterOrdersFieldset";
import useItemManager from "../../../hooks/useItemManager";
import FilterOrdersDialogPanel from "./FilterOrders.DialogPanel";

const clearedValue: ValueSchema = {
    id: "",
    minTotal: "",
    maxTotal: "",
    status: "",
    createdBefore: "",
    createdAfter: "",
    productId: "",
    productHistoryId: "",
};

export type ValueSchema = FilterOrdersFieldsetValueState;

export default function FilterOrdersController() {
    const { onClose } = useGlobalDialogPanelContext();
    const searchParams: Record<string, string> = useSearch({ strict: false });
    const initialValue: ValueSchema = {
        id: searchParams.id ?? "",
        minTotal: searchParams.minTotal ?? "",
        maxTotal: searchParams.maxTotal ?? "",
        status: searchParams.status ?? "",
        createdBefore: searchParams.createdBefore ?? "",
        createdAfter: searchParams.createdAfter ?? "",
        productId: searchParams.productId ?? "",
        productHistoryId: searchParams.productHistoryId ?? "",
    };
    const itemManager = useItemManager<ValueSchema>(initialValue);
    const navigate = useNavigate();

    return (
        <FilterOrdersDialogPanel
            value={itemManager.items}
            onClose={onClose}
            onSubmit={() => {
                navigate({ to: "/orders", search: itemManager.items });
                onClose();
            }}
            onReset={() => itemManager.setAll(initialValue)}
            onChange={itemManager.setAll}
            onClear={() => itemManager.setAll(clearedValue)}
        />
    );
}
