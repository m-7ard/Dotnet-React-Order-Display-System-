import Divider from "../components/Resuables/Divider";
import MixinButton from "../components/Resuables/MixinButton";
import MixinPanel, { MixinPanelSection } from "../components/Resuables/MixinPanel";
import { useApplicationExceptionContext } from "./Application.ExceptionProvider.Context";

export default function ApplicationExceptionNotice() {
    const { exception, dismissException } = useApplicationExceptionContext();

    if (exception == null) {
        return null;
    }

    return (
        <MixinPanel
            className="fixed mx-auto top-4 left-4 right-4"
            options={{
                size: "mixin-panel-base",
                theme: "theme-panel-generic-white",
            }}
            style={{ zIndex: 1_000_000 }}
            hasBorder
            hasShadow
        >
            <MixinPanelSection as="header" className="flex flex-row gap-3 items-center justify-between">
                <div className="token-default-title">Exception</div>
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    hasShadow
                    onClick={dismissException}
                >
                    Close
                </MixinButton>
            </MixinPanelSection>
            <Divider />
            <MixinPanelSection>
                <div>{exception.message}</div>
            </MixinPanelSection>
        </MixinPanel>
    );
}
