import MixinButton from "../Resuables/MixinButton";
import { useGlobalDialogPanelContext } from "../Dialog/GlobalDialog.Panel.Context";
import LinkBox from "../Resuables/LinkBox";
import MixinPanel, { MixinPanelSection } from "../Resuables/MixinPanel";
import FormPage from "./FilterProductResults.Pages.Form";
import ResultsPage from "./FilterProductResults.Pages.Results";
import Divider from "../Resuables/Divider";
import { IFilterProductResultsProps } from "./FilterProductResults.Types";

export default function FilterProductResults(props: IFilterProductResultsProps) {
    const { resultComponents, route, changeRoute, form } = props;
    const { onClose } = useGlobalDialogPanelContext();

    return (
        <MixinPanel
            options={{
                size: "mixin-panel-base",
                theme: "theme-panel-generic-white",
            }}
            hasShadow
            className="flex flex-col"
        >
            <MixinPanelSection className="flex flex-row gap-3 items-center justify-between">
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
                    hasShadow
                >
                    Close
                </MixinButton>
            </MixinPanelSection>
            <Divider />
            <MixinPanelSection className="flex flex-row gap-3">
                <MixinButton
                    options={{
                        size: "mixin-button-base",
                        theme: "theme-button-generic-white",
                    }}
                    type="button"
                    onClick={() => changeRoute("form")}
                    active={route === "form"}
                    className="basis-1/2 justify-center"
                >
                    Form
                </MixinButton>
                <MixinButton
                    options={{
                        size: "mixin-button-base",
                        theme: "theme-button-generic-white",
                    }}
                    type="button"
                    onClick={() => changeRoute("result")}
                    active={route === "result"}
                    className="basis-1/2 justify-center"
                >
                    Results
                </MixinButton>
            </MixinPanelSection>
            <Divider />
            <MixinPanelSection className="overflow-auto">
                {
                    {
                        form: <FormPage onReset={form.onReset} onSubmit={form.onSubmit} value={form.value} onChange={form.onChange} />,
                        result: <ResultsPage>{resultComponents}</ResultsPage>,
                    }[route]
                }
            </MixinPanelSection>
        </MixinPanel>
    );
}
