import MixinButton from "../../../components/Resuables/MixinButton";
import LinkBox from "../../../components/Resuables/LinkBox";
import MixinPanel, { MixinPanelSection } from "../../../components/Resuables/MixinPanel";
import FilterProductsFieldset from "../../../components/Fieldsets/FilterProductFieldset";
import routeData from "../../../routes/_routeData";
import { ValueSchema } from "./FilterProducts.Controller";
import Divider from "../../../components/Resuables/Divider";

export default function FilterProductsDialogPanel(props: {
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
            hasShadow
            as="form"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            onReset={(e) => {
                e.preventDefault();
                onReset();
            }}
        >
            <MixinPanelSection className="flex flex-row justify-between items-center">
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
                    type="button"
                >
                    Close
                </MixinButton>
            </MixinPanelSection>
            <Divider />
            <MixinPanelSection className="flex flex-col gap-3">
                <div className="token-default-title">Filter Products</div>
                <FilterProductsFieldset value={value} onChange={(value) => onChange(value)} />
            </MixinPanelSection>
            <Divider />
            <MixinPanelSection className="flex flex-row gap-3 justify-end">
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
