import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import { AbstractTooltipDefaultPanel } from "../../components/Resuables/AbstractTooltip";
import MixinPanel, { MixinPanelSection } from "../../components/Resuables/MixinPanel";
import StatelessRadioCheckboxField from "../../components/StatelessFields/StatelessRadioCheckboxField";
import { useAbstractTooltipContext } from "../../contexts/AbstractTooltipContext";
import routeData from "../../routes/_routeData";
import Divider from "../../components/Resuables/Divider";

export default function OrderByMenu() {
    const { onClose } = useAbstractTooltipContext();
    const navigate = useNavigate();
    const searchParams: Record<string, string> = useSearch({ strict: false });

    const orderBy = searchParams.orderBy;
    const onChange = useCallback(
        (value: string) => {
            navigate({ to: routeData.listProductHistories.pattern, search: { ...searchParams, orderBy: value } });
            onClose();
        },
        [navigate, searchParams, onClose],
    );

    return (
        <AbstractTooltipDefaultPanel className={`z-10 fixed mt-1`}>
            <MixinPanel
                options={{
                    size: "mixin-panel-base",
                    theme: "theme-panel-generic-white",
                }}
                hasBorder
                hasShadow
            >
                <MixinPanelSection className="flex flex-row gap-5 items-center justify-between">
                    <div className="text-sm">Newest</div>
                    <StatelessRadioCheckboxField name={"orderBy"} onChange={onChange} value={"newest"} checked={orderBy === "newest"} />
                </MixinPanelSection>
                <Divider />
                <MixinPanelSection className="flex flex-row gap-5 items-center justify-between">
                    <div className="text-sm">Oldest</div>
                    <StatelessRadioCheckboxField name={"orderBy"} onChange={onChange} value={"oldest"} checked={orderBy === "oldest"} />
                </MixinPanelSection>
                <Divider />
                <MixinPanelSection className="flex flex-row gap-5 items-center justify-between">
                    <div className="text-sm">Price - Lowest to Highest</div>
                    <StatelessRadioCheckboxField name={"orderBy"} onChange={onChange} value={"price asc"} checked={orderBy === "price asc"} />
                </MixinPanelSection>
                <Divider />
                <MixinPanelSection className="flex flex-row gap-5 items-center justify-between">
                    <div className="text-sm">Product Id - Highest to Lowest</div>
                    <StatelessRadioCheckboxField name={"orderBy"} onChange={onChange} value={"product id desc"} checked={orderBy === "product id desc"} />
                </MixinPanelSection>
                <Divider />
                <MixinPanelSection className="flex flex-row gap-5 items-center justify-between">
                    <div className="text-sm">Product Id - Highest to Lowest</div>
                    <StatelessRadioCheckboxField name={"orderBy"} onChange={onChange} value={"product id asc"} checked={orderBy === "product id asc"} />
                </MixinPanelSection>
            </MixinPanel>
        </AbstractTooltipDefaultPanel>
    );
}
