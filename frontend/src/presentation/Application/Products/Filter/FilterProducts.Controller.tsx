import { useNavigate, useSearch } from "@tanstack/react-router";
import useItemManager from "../../../hooks/useItemManager";
import { useGlobalDialogPanelContext } from "../../../components/Dialog/GlobalDialog.Panel.Context";
import { FilterProductsFieldsetValueState } from "../../../components/Fieldsets/FilterProductFieldset";
import FilterProductsDialogPanel from "./FilterProducts.DialogPanel";

export type ValueSchema = FilterProductsFieldsetValueState;

export default function FilterProductsController() {
    const { onClose } = useGlobalDialogPanelContext();
    const searchParams: Record<string, string> = useSearch({ strict: false });
    const initialValue = {
        id: searchParams.id ?? "",
        name: searchParams.name ?? "",
        minPrice: searchParams.minPrice ?? "",
        maxPrice: searchParams.maxPrice ?? "",
        description: searchParams.description ?? "",
        createdBefore: searchParams.createdBefore ?? "",
        createdAfter: searchParams.createdAfter ?? "",
    };
    const itemManager = useItemManager<ValueSchema>(initialValue);
    const navigate = useNavigate();

    return (
        <FilterProductsDialogPanel
            value={itemManager.items}
            onClose={onClose}
            onSubmit={() => {
                navigate({ to: "/products", search: itemManager.items });
                onClose();
            }}
            onReset={() => itemManager.setAll(initialValue)}
            onChange={itemManager.setAll}
        />
    );
}
