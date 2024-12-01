import FilterOrdersFieldset from "../../../components/Fieldsets/FilterOrdersFieldset";
import LinkBox from "../../../components/Resuables/LinkBox";
import MixinButton from "../../../components/Resuables/MixinButton";
import MixinPanel from "../../../components/Resuables/MixinPanel";
import routeData from "../../../routes/_routeData";
import { ValueSchema } from "./FilterOrders.Controller";

export default function FilterOrdersDialogPanel(props: { value: ValueSchema; onSubmit: () => void; onReset: () => void; onClose: () => void; onChange: (value: ValueSchema) => void; onClear: () => void }) {
    const { value, onSubmit, onReset, onClose, onChange, onClear } = props;

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
                    onSubmit();
                }}
                onReset={(e) => {
                    e.preventDefault();
                    onReset();
                }}
            >
                <div className="flex flex-col gap-2">
                    <FilterOrdersFieldset value={value} onChange={onChange} />
                </div>
                <footer className="flex flex-row gap-2">
                    <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="button" onClick={onClear}>
                        Clear
                    </MixinButton>
                    <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="reset" className="ml-auto">
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
