import { useNavigate, useSearch } from "@tanstack/react-router";
import FormField from "../../../components/Forms/FormField";
import MixinButton from "../../../components/Resuables/MixinButton";
import StatelessCharField from "../../../components/StatelessFields/StatelessCharField";
import useItemManager from "../../../hooks/useItemManager";
import StatelessTextArea from "../../../components/StatelessFields/StatelessTextArea";
import { useGlobalDialogPanelContext } from "../../../components/Dialog/GlobalDialogPanelContext";
import Linkbox from "../../../components/Resuables/LinkBox";
import MixinPanel from "../../../components/Resuables/MixinPanel";

type ValueState = {
    id: string;
    name: string;
    minPrice: string;
    maxPrice: string;
    description: string;
    createdBefore: string;
    createdAfter: string;
};

export default function FilterProductsDialogPanel() {
    const searchParams: Record<string, string> = useSearch({ strict: false });
    const initialValueState: ValueState = {
        id: searchParams.id ?? "",
        name: searchParams.name ?? "",
        minPrice: searchParams.minPrice ?? "",
        maxPrice: searchParams.maxPrice ?? "",
        description: searchParams.description ?? "",
        createdBefore: searchParams.createdBefore ?? "",
        createdAfter: searchParams.createdAfter ?? "",
    };
    const { onClose } = useGlobalDialogPanelContext();
    const itemManager = useItemManager<ValueState>(initialValueState);
    const navigate = useNavigate();

    return (
        <MixinPanel
            as="form"
            onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/products", search: itemManager.items });
                onClose();
            }}
            onReset={(e) => {
                e.preventDefault();
                itemManager.setAll(initialValueState);
            }}
            options={{
                size: "mixin-panel-base",
                theme: "theme-panel-generic-white",
            }}
        >
            <header className="flex flex-row justify-between items-center">
                <Linkbox
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
            <section className="flex flex-col gap-2">
                <FormField name="name">
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={itemManager.items.name}
                        onChange={(value) => itemManager.updateItem("name", value)}
                    />
                </FormField>
                <div className="flex flex-row gap-2">
                    <div className="basis-1/2">
                        <FormField name="minPrice">
                            <StatelessCharField
                                options={{
                                    size: "mixin-char-input-base",
                                    theme: "theme-input-generic-white",
                                }}
                                value={itemManager.items.minPrice}
                                onChange={(value) => itemManager.updateItem("minPrice", value)}
                            />
                        </FormField>
                    </div>
                    <div className="basis-1/2">
                        <FormField name="maxPrice">
                            <StatelessCharField
                                options={{
                                    size: "mixin-char-input-base",
                                    theme: "theme-input-generic-white",
                                }}
                                value={itemManager.items.maxPrice}
                                onChange={(value) => itemManager.updateItem("maxPrice", value)}
                            />
                        </FormField>
                    </div>
                </div>
                <FormField name="description">
                    <StatelessTextArea
                        onChange={(value) => itemManager.updateItem("description", value)}
                        value={itemManager.items.description}
                        options={{
                            size: "mixin-textarea-any",
                            theme: "theme-textarea-generic-white",
                        }}
                        rows={5}
                        maxLength={1028}
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
            </section>
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
        </MixinPanel>
    );
}
