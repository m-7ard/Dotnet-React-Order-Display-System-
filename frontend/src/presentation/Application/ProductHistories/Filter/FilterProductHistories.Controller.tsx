import { useNavigate, useSearch } from "@tanstack/react-router";
import useItemManager from "../../../hooks/useItemManager";
import { useGlobalDialogPanelContext } from "../../../components/Dialog/GlobalDialog.Panel.Context";
import { FilterProductHistoriesFieldsetValueState } from "../../../components/Fieldsets/FilterProductHistoriesFieldset";
import FilterProductHistoriesDialogPanel from "./FilterProductHistories.DialogPanel";
import routeData from "../../../routes/_routeData";
import { useCallback } from "react";

export type ValueSchema = { [K in keyof FilterProductHistoriesFieldsetValueState]: FilterProductHistoriesFieldsetValueState[K] | undefined };

export default function FilterProductHistoriesController() {
    const searchParams: Partial<Record<string, string>> = useSearch({ strict: false });
    const initialValue = {
        name: searchParams.name,
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice,
        description: searchParams.description,
        validTo: searchParams.validTo,
        validFrom: searchParams.validFrom,
        productId: searchParams.productId,
    };
    const { onClose } = useGlobalDialogPanelContext();
    const itemManager = useItemManager<ValueSchema>(initialValue);
    const navigate = useNavigate();

    const fromRequiredToPartial = useCallback(
        (value: Required<ValueSchema>) => {
            const formValue = Object.entries(value).map(([key, val]) => [key, val === "" ? undefined : val]);
            itemManager.setAll(Object.fromEntries(formValue));
        },
        [itemManager],
    );

    const fromPartialToRequired = useCallback((): ValueSchema => {
        const formValue = Object.entries(itemManager.items).map(([key, val]) => [key, val ?? ""]);
        return Object.fromEntries(formValue);
    }, [itemManager]);

    return (
        <FilterProductHistoriesDialogPanel
            value={fromPartialToRequired()}
            onClose={onClose}
            onSubmit={() => {
                navigate({ to: routeData.listProductHistories.pattern, search: itemManager.items });
                onClose();
            }}
            onReset={() => itemManager.setAll(initialValue)}
            onChange={fromRequiredToPartial}
            onClear={() =>
                itemManager.setAll({
                    name: undefined,
                    minPrice: undefined,
                    maxPrice: undefined,
                    description: undefined,
                    validTo: undefined,
                    validFrom: undefined,
                    productId: undefined,
                })
            }
        />
    );
}
