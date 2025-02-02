import { Link, useLocation } from "@tanstack/react-router";
import GlobalDialog from "../components/Dialog/GlobalDialog";
import MixinButton from "../components/Resuables/MixinButton";
import routeData from "../routes/_routeData";
import SidebarMenuDialog from "./Application.SidebarMenu";
import Divider from "../components/Resuables/Divider";
import MixinContentGrid, { MixinContentGridTrack } from "../components/Resuables/MixinContentGrid";

export default function ApplicationHeader() {
    const location = useLocation();

    return (
        <>
            <MixinContentGrid className="bg-gray-50 overflow-auto shrink-0 z-10 relative" exp={() => ({})}>
                <MixinContentGridTrack className="py-2 px-4 flex flex-row gap-3 items-center mx-auto border-x token-default-border-color" exp={(options) => ({ track: options.TRACK.BASE })}>
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
                </MixinContentGridTrack>
            </MixinContentGrid>
            <div className="shadow relative">
                <Divider />
            </div>
        </>
    );
}
