import MixinButton from "../../../components/Resuables/MixinButton";
import LinkBox from "../../../components/Resuables/LinkBox";
import MixinPanel from "../../../components/Resuables/MixinPanel";
import FilterProductHistoriesFieldset from "../../../components/Fieldsets/FilterProductHistoriesFieldset";
import routeData from "../../../routes/_routeData";
import { ValueSchema } from "./FilterProductHistories.Controller";

export default function FilterProductHistoriesDialogPanel(props: { value: ValueSchema; onSubmit: () => void; onReset: () => void; onClose: () => void; onChange: (value: ValueSchema) => void; onClear: () => void }) {
    const { value, onSubmit, onReset, onClose, onChange, onClear } = props;

    return (
        <MixinPanel
            options={{
                size: "mixin-panel-base",
                theme: "theme-panel-generic-white",
            }}
        >
            <header className="flex flex-row justify-between items-center flex-wrap">
                <LinkBox
                    parts={[
                        { isLink: true, to: routeData.listProductHistories.build({}), label: "Product Histories" },
                        { isLink: false, label: "Filter" },
                    ]}
                />
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
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
                    <FilterProductHistoriesFieldset value={value} onChange={onChange} />
                </fieldset>
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
