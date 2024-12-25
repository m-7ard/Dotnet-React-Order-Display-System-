import { useLocation, Link } from "@tanstack/react-router";
import { useGlobalDialogPanelContext } from "../components/Dialog/GlobalDialog.Panel.Context";
import MixinButton from "../components/Resuables/MixinButton";
import MixinPanel, { MixinPanelSection } from "../components/Resuables/MixinPanel";
import routeData from "../routes/_routeData";
import Divider from "../components/Resuables/Divider";

export default function SidebarMenuDialog() {
    const { onClose } = useGlobalDialogPanelContext();
    const location = useLocation();

    return (
        <MixinPanel
            options={{
                size: "mixin-panel-base",
                theme: "theme-panel-generic-white",
            }}
            className="top-0 bottom-0 left-0 fixed w-72 rounded-none"
        >
            <MixinPanelSection className="flex flex-row justify-between items-center">
                <div className="text-base font-semibold">Menu</div>
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
            <MixinPanelSection className="flex flex-col gap-3">
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
            </MixinPanelSection>
        </MixinPanel>
    );
}
