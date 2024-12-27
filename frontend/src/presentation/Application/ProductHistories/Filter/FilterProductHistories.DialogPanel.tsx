import MixinButton from "../../../components/Resuables/MixinButton";
import LinkBox from "../../../components/Resuables/LinkBox";
import MixinPanel, { MixinPanelSection } from "../../../components/Resuables/MixinPanel";
import FilterProductHistoriesFieldset from "../../../components/Fieldsets/FilterProductHistoriesFieldset";
import routeData from "../../../routes/_routeData";
import { ValueSchema } from "./FilterProductHistories.Controller";
import Divider from "../../../components/Resuables/Divider";

export default function FilterProductHistoriesDialogPanel(props: {
    value: Required<ValueSchema>;
    onSubmit: () => void;
    onReset: () => void;
    onClose: () => void;
    onChange: (value: Required<ValueSchema>) => void;
    onClear: () => void;
}) {
    const { value, onSubmit, onReset, onClose, onChange, onClear } = props;

    return (
        <MixinPanel
            options={{
                size: "mixin-panel-base",
                theme: "theme-panel-generic-white",
            }}
            as="form"
            hasShadow
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            onReset={(e) => {
                e.preventDefault();
                onReset();
            }}
            className="flex flex-col"
        >
            <MixinPanelSection className="flex flex-row justify-between items-center flex-wrap gap-3">
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
                    hasShadow
                >
                    Close
                </MixinButton>
            </MixinPanelSection>
            <Divider />
            <MixinPanelSection className="flex flex-col gap-3 overflow-auto">
                <div className="token-default-title">Filter Product Histories</div>
                <FilterProductHistoriesFieldset value={value} onChange={onChange} />
            </MixinPanelSection>
            <Divider />
            <MixinPanelSection className="flex flex-row gap-3">
                <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="button" onClick={onClear}>
                    Clear
                </MixinButton>
                <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="reset" className="ml-auto">
                    Reset
                </MixinButton>
                <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }} type="submit">
                    Filter
                </MixinButton>
            </MixinPanelSection>
        </MixinPanel>
    );
}
