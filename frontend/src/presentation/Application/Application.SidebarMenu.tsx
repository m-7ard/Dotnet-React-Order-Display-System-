import { useLocation, Link } from "@tanstack/react-router";
import { useGlobalDialogPanelContext } from "../components/Dialog/GlobalDialog.Panel.Context";
import MixinButton from "../components/Resuables/MixinButton";
import routeData from "../routes/_routeData";
import Divider from "../components/Resuables/Divider";
import { RenderedMixinPanel, PolymorphicMixinPanelSection } from "../components/Resuables/MixinPanel";

export default function SidebarMenuDialog() {
    const { onClose } = useGlobalDialogPanelContext();
    const location = useLocation();

    return (
        <RenderedMixinPanel exp={(options) => ({ hasBorder: true, hasShadow: true, size: options.SIZE.BASE, theme: options.THEMES.GENERIC_WHITE })} className="top-0 bottom-0 left-0 fixed w-72 rounded-none">
            {(mixinPanelProps) => (
                <div {...mixinPanelProps}>
                    <PolymorphicMixinPanelSection className="flex flex-row justify-between items-center">
                        <div className="text-sm font-semibold">Menu</div>
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
                    </PolymorphicMixinPanelSection>
                    <Divider />
                    <PolymorphicMixinPanelSection className="flex flex-col gap-1">
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
                    </PolymorphicMixinPanelSection>
                </div>
            )}
        </RenderedMixinPanel>
    );
}
