import { useNavigate, useSearch } from "@tanstack/react-router";
import MixinButton from "../../../components/Resuables/MixinButton";
import useItemManager from "../../../hooks/useItemManager";
import { useGlobalDialogPanelContext } from "../../../components/Dialog/GlobalDialogPanelContext";
import LinkBox from "../../../components/Resuables/LinkBox";
import MixinPanel from "../../../components/Resuables/MixinPanel";
import FilterProductsFieldset, {
    FilterProductsFieldsetValueState,
} from "../../../components/Fieldsets/FilterProductFieldset";

export default function FilterProductsDialogPanel() {
    const searchParams: Record<string, string> = useSearch({ strict: false });
    const initialValueState: FilterProductsFieldsetValueState = {
        id: searchParams.id ?? "",
        name: searchParams.name ?? "",
        minPrice: searchParams.minPrice ?? "",
        maxPrice: searchParams.maxPrice ?? "",
        description: searchParams.description ?? "",
        createdBefore: searchParams.createdBefore ?? "",
        createdAfter: searchParams.createdAfter ?? "",
    };
    const { onClose } = useGlobalDialogPanelContext();
    const itemManager = useItemManager<FilterProductsFieldsetValueState>(initialValueState);
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
                        { isLink: false, label: "Products" },
                        { isLink: false, label: "Filter" },
                    ]}
                />
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
                    className=" "
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
                    navigate({ to: "/products", search: itemManager.items });
                    onClose();
                }}
                onReset={(e) => {
                    e.preventDefault();
                    itemManager.setAll(initialValueState);
                }}
            >
                <fieldset className="flex flex-col gap-2">
                    <FilterProductsFieldset
                        data={itemManager.items}
                        onChange={(field, value) => itemManager.updateItem(field, value)}
                    />
                </fieldset>
                <footer className="flex flex-row gap-2 justify-end">
                    <MixinButton
                        options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                        type="reset"
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
