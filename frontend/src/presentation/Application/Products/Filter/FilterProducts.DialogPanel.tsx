import MixinButton from "../../../components/Resuables/MixinButton";
import LinkBox from "../../../components/Resuables/LinkBox";
import MixinPanel from "../../../components/Resuables/MixinPanel";
import FilterProductsFieldset from "../../../components/Fieldsets/FilterProductFieldset";
import routeData from "../../../routes/_routeData";
import { ValueSchema } from "./FilterProducts.Controller";
import Divider from "../../../components/Resuables/Divider";
import panelSection from "../../../attribute-mixins/panelSection";

export default function FilterProductsDialogPanel(props: { value: ValueSchema; onSubmit: () => void; onReset: () => void; onClose: () => void; onChange: (value: ValueSchema) => void }) {
    const { value, onSubmit, onReset, onClose, onChange } = props;

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
            <header className="flex flex-row justify-between items-center" {...panelSection}>
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
            <Divider />
            <fieldset className="flex flex-col gap-3" {...panelSection}>
                <FilterProductsFieldset value={value} onChange={(value) => onChange(value)} />
            </fieldset>
            <Divider />
            <footer className="flex flex-row gap-3 justify-end" {...panelSection}>
                <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="reset">
                    Reset
                </MixinButton>
                <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }} type="submit">
                    Filter
                </MixinButton>
            </footer>
        </MixinPanel>
    );
}
