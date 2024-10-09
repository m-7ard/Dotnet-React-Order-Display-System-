import { useNavigate, useSearch } from "@tanstack/react-router";
import MixinButton from "../../../components/Resuables/MixinButton";
import useItemManager from "../../../hooks/useItemManager";
import { useGlobalDialogPanelContext } from "../../../components/Dialog/GlobalDialogPanelContext";
import LinkBox from "../../../components/Resuables/LinkBox";
import FilterOrdersFieldset, {
    FilterOrdersFieldsetValueState,
} from "../../../components/Fieldsets/FilterOrdersFieldset";
import MixinPanel from "../../../components/Resuables/MixinPanel";
import routeData from "../../../routes/_routeData";

export default function FilterProductsDialogPanel() {
    const searchParams: Record<string, string> = useSearch({ strict: false });
    const initialValueState: FilterOrdersFieldsetValueState = {
        id: searchParams.id ?? "",
        minTotal: searchParams.minTotal ?? "",
        maxTotal: searchParams.maxTotal ?? "",
        status: searchParams.status ?? "",
        createdBefore: searchParams.createdBefore ?? "",
        createdAfter: searchParams.createdAfter ?? "",
        productId: searchParams.productId ?? "",
        productHistoryId: searchParams.productHistoryId ?? "",
    };
    const { onClose } = useGlobalDialogPanelContext();
    const itemManager = useItemManager<FilterOrdersFieldsetValueState>(initialValueState);
    const navigate = useNavigate();

    return (
        <MixinPanel
            options={{
                size: "mixin-panel-base",
                theme: "theme-panel-generic-white",
            }}
        >
            <header className="flex flex-row justify-between items-center">
                <LinkBox
                    parts={[
                        { isLink: true, to: routeData.listOrders.build({}), label: "Orders" },
                        { isLink: false, label: "Filter" },
                    ]}
                />
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
                    className=""
                    type="button"
                >
                    Close
                </MixinButton>
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <form
                className="flex flex-col gap-[inherit]"
                onSubmit={(e) => {
                    e.preventDefault();
                    navigate({ to: routeData.listOrders.build({}), search: itemManager.items });
                    onClose();
                }}
                onReset={(e) => {
                    e.preventDefault();
                    itemManager.setAll(initialValueState);
                }}
            >
                <div className="flex flex-col gap-2">
                    <FilterOrdersFieldset
                        data={itemManager.items}
                        onChange={(field, value) => itemManager.updateItem(field, value)}
                    />
                </div>
                <footer className="flex flex-row gap-2">
                    <MixinButton
                        options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                        type="button"
                        onClick={() => {
                            Object.keys(itemManager.items).forEach((field) =>
                                itemManager.updateItem(field as keyof FilterOrdersFieldsetValueState, ""),
                            );
                        }}
                    >
                        Clear
                    </MixinButton>
                    <MixinButton
                        options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                        type="reset"
                        className="ml-auto"
                    >
                        Reset
                    </MixinButton>
                    <MixinButton
                        options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }}
                        type="submit"
                    >
                        Filter
                    </MixinButton>
                </footer>
            </form>
        </MixinPanel>
    );
}
