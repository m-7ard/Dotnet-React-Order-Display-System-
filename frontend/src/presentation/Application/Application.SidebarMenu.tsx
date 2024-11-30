import { useLocation, Link } from "@tanstack/react-router";
import { useGlobalDialogPanelContext } from "../components/Dialog/GlobalDialog.Panel.Context";
import MixinButton from "../components/Resuables/MixinButton";
import MixinPanel from "../components/Resuables/MixinPanel";
import routeData from "../routes/_routeData";

export default function SidebarMenuDialog() {
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
