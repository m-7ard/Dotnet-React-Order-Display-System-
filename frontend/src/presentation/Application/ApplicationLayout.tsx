import { Link, Outlet, useLocation } from "@tanstack/react-router";
import ApplicationProvider from "./ApplicationProvider";
import { useApplicationExceptionContext } from "../contexts/ApplicationExceptionHandlerContext";
import MixinButton from "../components/Resuables/MixinButton";
import GlobalDialog from "../components/Dialog/GlobalDialog";
import MixinPanel from "../components/Resuables/MixinPanel";
import { useGlobalDialogPanelContext } from "../components/Dialog/GlobalDialogPanelContext";
import routeData from "../routes/_routeData";

function ApplicationHeader() {
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

function SidebarMenuDialog() {
    const { onClose } = useGlobalDialogPanelContext();
    const location = useLocation();

    return (
        <MixinPanel
            options={{
                size: "mixin-panel-base",
                theme: "theme-panel-generic-white",
            }}
            className="top-0 bottom-0 left-0 fixed"
        >
            <header className="flex flex-row justify-between items-center">
                <div className="text-sm">Menu</div>
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
            <div className="flex flex-col gap-2">
                <Link className="w-full" to={routeData.frontpage.build({})}>
                    <MixinButton
                        className="w-full justify-center"
                        options={{
                            size: "mixin-button-base",
                            theme: "theme-button-generic-white",
                        }}
                        active={location.pathname === "/"}
                    >
                        Frontpage
                    </MixinButton>
                </Link>
                <Link className="w-full" to={routeData.listProducts.build({})}>
                    <MixinButton
                        className="w-full justify-center"
                        options={{
                            size: "mixin-button-base",
                            theme: "theme-button-generic-white",
                        }}
                        active={location.pathname === "/products"}
                    >
                        Products
                    </MixinButton>
                </Link>
                <Link className="w-full" to={routeData.listOrders.build({})}>
                    <MixinButton
                        className="w-full justify-center"
                        options={{
                            size: "mixin-button-base",
                            theme: "theme-button-generic-white",
                        }}
                        active={location.pathname === "/orders"}
                    >
                        Orders
                    </MixinButton>
                </Link>
                <Link className="w-full" to={routeData.listProductHistories.build({})}>
                    <MixinButton
                        className="w-full justify-center"
                        options={{
                            size: "mixin-button-base",
                            theme: "theme-button-generic-white",
                        }}
                        active={location.pathname === "/product_histories"}
                    >
                        Product Histories
                    </MixinButton>
                </Link>
            </div>
        </MixinPanel>
    );
}

function ApplicationExceptionNotice() {
    const { exception, dismissException } = useApplicationExceptionContext();

    if (exception == null) {
        return null;
    }

    return (
        <div
            className="fixed mx-auto top-4 left-4 right-4 flex flex-col bg-red-400 border border-gray-900 p-4 gap-4 text-gray-900 max-w-96"
            style={{ zIndex: 1000000 }}
        >
            <div className="flex flex-row gap-4 justify-between items-center">
                <div className="text-sm">{exception.message}</div>
                <div className="mixin-button-like" onClick={dismissException}>
                    ✖
                </div>
            </div>
        </div>
    );
}

export default function ApplicationLayout() {
    return (
        <ApplicationProvider>
            <main
                className="
                    flex
                    flex-col
                    bg-gray-50
                    h-full
                    w-full 
                    mx-auto 
                    overflow-hidden 
                    border-x 
                    border-gray-900
                    text-gray-900"
            >
                <ApplicationExceptionNotice />
                <ApplicationHeader />
                <Outlet />
            </main>
        </ApplicationProvider>
    );
}
