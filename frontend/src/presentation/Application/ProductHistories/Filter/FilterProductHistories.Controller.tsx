import { useNavigate, useSearch } from "@tanstack/react-router";
import useItemManager from "../../../hooks/useItemManager";
import { useGlobalDialogPanelContext } from "../../../components/Dialog/GlobalDialog.Panel.Context";
import {
    FilterProductHistoriesFieldsetValueState,
} from "../../../components/Fieldsets/FilterProductHistoriesFieldset";
import FilterProductHistoriesDialogPanel from "./FilterProductHistories.DialogPanel";
import routeData from "../../../routes/_routeData";

export type ValueSchema = FilterProductHistoriesFieldsetValueState;

const clearedValue: ValueSchema = {
    name: "",
    minPrice: "",
    maxPrice: "",
    description: "",
    validTo: "",
    validFrom: "",
    productId: "",
};

export default function FilterProductHistoriesController() {
    const searchParams: Record<string, string> = useSearch({ strict: false });
    const initialValue: ValueSchema = {
        name: searchParams.name ?? "",
        minPrice: searchParams.minPrice ?? "",
        maxPrice: searchParams.maxPrice ?? "",
        description: searchParams.description ?? "",
        validTo: searchParams.validTo ?? "",
        validFrom: searchParams.validFrom ?? "",
        productId: searchParams.productId ?? "",
    };
    const { onClose } = useGlobalDialogPanelContext();
    const itemManager = useItemManager<ValueSchema>(initialValue);
    const navigate = useNavigate();

    return <FilterProductHistoriesDialogPanel
        value={itemManager.items}
        onClose={onClose}
        onSubmit={() => {
            navigate({ to: routeData.listProductHistories.pattern, search: itemManager.items });
            onClose();
        }}
        onReset={() => itemManager.setAll(initialValue)}
        onChange={itemManager.setAll}
        onClear={() => itemManager.setAll(clearedValue)}
    />
}
