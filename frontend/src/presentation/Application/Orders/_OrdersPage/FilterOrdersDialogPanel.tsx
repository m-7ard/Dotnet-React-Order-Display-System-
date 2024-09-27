import { useNavigate, useSearch } from "@tanstack/react-router";
import FormField from "../../../components/Forms/FormField";
import MixinButton from "../../../components/Resuables/MixinButton";
import StatelessCharField from "../../../components/StatelessFields/StatelessCharField";
import useItemManager from "../../../hooks/useItemManager";
import StatelessListBox from "../../../components/StatelessFields/StatelessListBox";
import OrderStatus from "../../../../domain/valueObjects/Order/OrderStatus";
import { useGlobalDialogPanelContext } from "../../../components/Dialog/GlobalDialogPanelContext";
import Linkbox from "../../../components/Resuables/LinkBox";
import FilterOrdersFieldset, {
    FilterOrdersFieldsetValueState,
} from "../../../components/Fieldsets/FilterOrdersFieldset";

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
    };
    const { onClose } = useGlobalDialogPanelContext();
    const itemManager = useItemManager<FilterOrdersFieldsetValueState>(initialValueState);
    const navigate = useNavigate();

    return (
        <form
            className="  mixin-page-like mixin-page-base bg-gray-50 border border-gray-900 m-auto max-w-72"
            onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/orders", search: itemManager.items });
                onClose();
            }}
            onReset={(e) => {
                e.preventDefault();
                itemManager.setAll(initialValueState);
            }}
        >
            <header className="flex flex-row justify-between items-center">
                <Linkbox
                    parts={[
                        { isLink: true, to: "/orders", label: "Orders" },
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
            <fieldset className="flex flex-col gap-2 p-4 bg-gray-100 border border-gray-900">
                <FilterOrdersFieldset
                    data={itemManager.items}
                    onChange={(field, value) => itemManager.updateItem(field, value)}
                />
            </fieldset>
            <footer className="flex flex-row gap-2">
                <MixinButton
                    className="  overflow-hidden basis-1/2 justify-center"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                    type="reset"
                >
                    Reset
                </MixinButton>
                <MixinButton
                    className="  overflow-hidden basis-1/2 justify-center"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }}
                    type="submit"
                >
                    Filter
                </MixinButton>
            </footer>
        </form>
    );
}
