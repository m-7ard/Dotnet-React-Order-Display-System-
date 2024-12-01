import MixinButton from "../../../components/Resuables/MixinButton";
import LinkBox from "../../../components/Resuables/LinkBox";
import MixinPanel from "../../../components/Resuables/MixinPanel";
import FilterProductsFieldset from "../../../components/Fieldsets/FilterProductFieldset";
import routeData from "../../../routes/_routeData";
import { ValueSchema } from "./FilterProducts.Controller";

export default function FilterProductsDialogPanel(props: { value: ValueSchema; onSubmit: () => void; onReset: () => void; onClose: () => void; onChange: (value: ValueSchema) => void }) {
    const { value, onSubmit, onReset, onClose, onChange } = props;

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
                        { isLink: true, to: routeData.listProducts.build({}), label: "Products" },
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
                    onSubmit();
                }}
                onReset={(e) => {
                    e.preventDefault();
                    onReset();
                }}
            >
                <fieldset className="flex flex-col gap-2">
                    <FilterProductsFieldset value={value} onChange={(value) => onChange(value)} />
                </fieldset>
                <footer className="flex flex-row gap-2 justify-end">
                    <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="reset">
                        Reset
                    </MixinButton>
                    <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }} type="submit">
                        Filter
                    </MixinButton>
                </footer>
            </form>
        </MixinPanel>
    );
}
