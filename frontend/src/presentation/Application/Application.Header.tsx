import GlobalDialog from "../components/Dialog/GlobalDialog";
import MixinButton from "../components/Resuables/MixinButton";
import SidebarMenuDialog from "./Application.SidebarMenu";

export default function ApplicationHeader() {
    return (
        <header className="py-2 px-4 flex flex-row gap-2 bg-gray-50 items-center border-b border-gray-900">
            <GlobalDialog
                zIndex={10}
                Trigger={({ onToggle }) => (
                    <MixinButton
                        options={{
                            size: "mixin-button-base",
                            theme: "theme-button-generic-white",
                        }}
                        type="button"
                        onClick={onToggle}
                    >
                        ☰
                    </MixinButton>
                )}
                Panel={SidebarMenuDialog}
                panelProps={{}}
            ></GlobalDialog>
        </header>
    );
}