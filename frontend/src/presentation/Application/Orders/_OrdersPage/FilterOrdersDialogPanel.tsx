import { useNavigate, useSearch } from "@tanstack/react-router";
import FormField from "../../../components/Forms/FormField";
import MixinButton from "../../../components/Resuables/MixinButton";
import StatelessCharField from "../../../components/StatelessFields/StatelessCharField";
import { useAbstractDialogContext } from "../../../contexts/AbstractDialogContext";
import useItemManager from "../../../hooks/useItemManager";
import StatelessListBox from "../../../components/StatelessFields/StatelessListBox";
import OrderStatus from "../../../../domain/valueObjects/Order/OrderStatus";

type ValueState = {
    id: string;
    minTotal: string;
    maxTotal: string;
    status: string;
    createdBefore: string;
    createdAfter: string;
    productId: string;
};

export default function FilterProductsDialogPanel() {
    const searchParams: Record<string, string> = useSearch({ from: "/orders" });
    const initialValueState: ValueState = {
        id: searchParams.id ?? "",
        minTotal: searchParams.minTotal ?? "",
        maxTotal: searchParams.maxTotal ?? "",
        status: searchParams.status ?? "",
        createdBefore: searchParams.createdBefore ?? "",
        createdAfter: searchParams.createdAfter ?? "",
        productId: searchParams.productId ?? "",
    };
    const { onClose } = useAbstractDialogContext();
    const itemManager = useItemManager<ValueState>(initialValueState);
    const navigate = useNavigate();

    return (
        <form
            id="headlessui-portal-root"
            className="rounded shadow mixin-page-like mixin-page-base bg-gray-50 border border-gray-900 m-auto max-w-72"
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
                <div className="text-xl text-gray-900 font-bold">Filter Orders</div>
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
                    className="rounded shadow"
                    type="button"
                >
                    Close
                </MixinButton>
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <section className="flex flex-col gap-2">
                <FormField name="id">
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={itemManager.items.id}
                        onChange={(value) => itemManager.updateItem("id", value)}
                    />
                </FormField>
                <div className="flex flex-row gap-2">
                    <div className="basis-1/2">
                        <FormField name="minTotal">
                            <StatelessCharField
                                options={{
                                    size: "mixin-char-input-base",
                                    theme: "theme-input-generic-white",
                                }}
                                value={itemManager.items.minTotal}
                                onChange={(value) => itemManager.updateItem("minTotal", value)}
                            />
                        </FormField>
                    </div>
                    <div className="basis-1/2">
                        <FormField name="maxTotal">
                            <StatelessCharField
                                options={{
                                    size: "mixin-char-input-base",
                                    theme: "theme-input-generic-white",
                                }}
                                value={itemManager.items.maxTotal}
                                onChange={(value) => itemManager.updateItem("maxTotal", value)}
                            />
                        </FormField>
                    </div>
                </div>
                <FormField name="status">
                    <StatelessListBox
                        onChange={(value) => {
                            console.log(value);
                            itemManager.updateItem("status", value);
                        }}
                        value={itemManager.items.status}
                        choices={[
                            {
                                value: OrderStatus.FINISHED.value,
                                label: OrderStatus.FINISHED.value,
                            },
                            {
                                value: OrderStatus.PENDING.value,
                                label: OrderStatus.PENDING.value,
                            },
                        ]}
                    />
                </FormField>
                <FormField name="createdBefore">
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={itemManager.items.createdBefore}
                        type="date"
                        onChange={(value) => itemManager.updateItem("createdBefore", value)}
                    />
                </FormField>
                <FormField name="createdAfter">
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={itemManager.items.createdAfter}
                        type="date"
                        onChange={(value) => itemManager.updateItem("createdAfter", value)}
                    />
                </FormField>
                <FormField name="productId">
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={itemManager.items.productId}
                        onChange={(value) => itemManager.updateItem("productId", value)}
                    />
                </FormField>
            </section>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <footer className="flex flex-row gap-2">
                <MixinButton
                    className="rounded shadow overflow-hidden basis-1/2 justify-center"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                    type="reset"
                >
                    Reset
                </MixinButton>
                <MixinButton
                    className="rounded shadow overflow-hidden basis-1/2 justify-center"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }}
                    type="submit"
                >
                    Filter
                </MixinButton>
            </footer>
        </form>
    );
}
