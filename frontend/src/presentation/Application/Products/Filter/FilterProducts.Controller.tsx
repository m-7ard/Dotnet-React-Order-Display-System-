import { useNavigate, useSearch } from "@tanstack/react-router";
import useItemManager from "../../../hooks/useItemManager";
import { useGlobalDialogPanelContext } from "../../../components/Dialog/GlobalDialog.Panel.Context";
import { FilterProductsFieldsetValueState } from "../../../components/Fieldsets/FilterProductFieldset";
import FilterProductsDialogPanel from "./FilterProducts.DialogPanel";
import { useCallback } from "react";

export type ValueSchema = { [K in keyof FilterProductsFieldsetValueState]?: FilterProductsFieldsetValueState[K] };

export default function FilterProductsController() {
    const { onClose } = useGlobalDialogPanelContext();
    const searchParams: Partial<Record<string, string>> = useSearch({ strict: false });
    const initialValue = {
        id: searchParams.id,
        name: searchParams.name,
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice,
        description: searchParams.description,
        createdBefore: searchParams.createdBefore,
        createdAfter: searchParams.createdAfter,
    };
    const itemManager = useItemManager<ValueSchema>(initialValue);
    const navigate = useNavigate();

    const fromRequiredToPartial = useCallback(
        (value: Required<ValueSchema>) => {
            const formValue = Object.entries(value).map(([key, val]) => [key, val === "" ? undefined : val]);
            itemManager.setAll(Object.fromEntries(formValue));
        },
        [itemManager],
    );

    const fromPartialToRequired = useCallback((): Required<ValueSchema> => {
        const formValue = Object.entries(itemManager.items).map(([key, val]) => [key, val ?? ""]);
        return Object.fromEntries(formValue);
    }, [itemManager]);

    return (
        <FilterProductsDialogPanel
            value={fromPartialToRequired()}
            onClose={onClose}
            onSubmit={() => {
                navigate({ to: "/products", search: itemManager.items });
                onClose();
            }}
            onReset={() => itemManager.setAll(initialValue)}
            onChange={fromRequiredToPartial}
        />
    );
}
