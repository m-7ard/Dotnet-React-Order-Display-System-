import { Link, useLocation } from "@tanstack/react-router";
import GlobalDialog from "../components/Dialog/GlobalDialog";
import MixinButton from "../components/Resuables/MixinButton";
import routeData from "../routes/_routeData";
import SidebarMenuDialog from "./Application.SidebarMenu";

export default function ApplicationHeader() {
    const location = useLocation();

    return (
        <header className="bg-gray-50 border-b border-gray-900 overflow-auto shrink-0">
            <div className="py-2 px-4 max-w-xl w-full flex flex-row gap-2 items-center mx-auto">
                <GlobalDialog
                    zIndex={10}
                    Trigger={({ onToggle }) => (
                        <MixinButton
                            options={{
                                size: "mixin-button-sm",
                                theme: "theme-button-generic-white",
                            }}
                            type="button"
                            onClick={onToggle}
                            className="shrink-0 truncate"
                        >
                            <div>☰</div>
                            <div>Menu</div>
                        </MixinButton>
                    )}
                    Panel={SidebarMenuDialog}
                    panelProps={{}}
                ></GlobalDialog>
                <Link to={routeData.frontpage.build({})}>
                    <MixinButton
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-white",
                        }}
                        active={location.pathname === "/"}
                    >
                        Frontpage
                    </MixinButton>
                </Link>
                <Link to={routeData.listProducts.pattern}>
                    <MixinButton
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-white",
                        }}
                        type="button"
                        active={location.pathname === "/products"}
                    >
                        Products
                    </MixinButton>
                </Link>
                <Link to={routeData.listProductHistories.pattern}>
                    <MixinButton
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-white",
                        }}
                        type="button"
                        className="truncate shrink-0"
                        active={location.pathname === "/product_histories"}
                    >
                        Product Histories
                    </MixinButton>
                </Link>
                <Link to={routeData.listOrders.pattern}>
                    <MixinButton
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-white",
                        }}
                        type="button"
                        active={location.pathname === "/orders"}
                    >
                        Orders
                    </MixinButton>
                </Link>
            </div>
        </header>
    );
}
