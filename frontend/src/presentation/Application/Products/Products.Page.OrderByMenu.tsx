import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import IListProductsRequestDTO from "../../../infrastructure/contracts/products/list/IListProductsRequestDTO";
import { AbstractTooltipDefaultPanel } from "../../components/Resuables/AbstractTooltip";
import MixinPanel from "../../components/Resuables/MixinPanel";
import StatelessRadioCheckboxField from "../../components/StatelessFields/StatelessRadioCheckboxField";
import { useAbstractTooltipContext } from "../../contexts/AbstractTooltipContext";
import routeData from "../../routes/_routeData";
import Divider from "../../components/Resuables/Divider";
import panelSection from "../../attribute-mixins/panelSection";

export default function OrderByMenu() {
    const { onClose } = useAbstractTooltipContext();
    const navigate = useNavigate();
    const searchParams: Record<keyof IListProductsRequestDTO, string> = useSearch({ strict: false });

    const orderBy = searchParams.orderBy;
    const onChange = useCallback(
        (value: string) => {
            navigate({ to: routeData.listProducts.pattern, search: { ...searchParams, orderBy: value } });
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
                <div className="flex flex-row gap-5 items-center justify-between" {...panelSection}>
                    <div className="text-sm">Newest</div>
                    <StatelessRadioCheckboxField name={"orderBy"} onChange={onChange} value={"newest"} checked={orderBy === "newest"} />
                </div>
                <Divider />
                <div className="flex flex-row gap-5 items-center justify-between" {...panelSection}>
                    <div className="text-sm">Oldest</div>
                    <StatelessRadioCheckboxField name={"orderBy"} onChange={onChange} value={"oldest"} checked={orderBy === "oldest"} />
                </div>
                <Divider />
                <div className="flex flex-row gap-5 items-center justify-between" {...panelSection}>
                    <div className="text-sm">Price - Lowest to Highest</div>
                    <StatelessRadioCheckboxField name={"orderBy"} onChange={onChange} value={"price asc"} checked={orderBy === "price asc"} />
                </div>
                <Divider />
                <div className="flex flex-row gap-5 items-center justify-between" {...panelSection}>
                    <div className="text-sm">Price - Highest to Lowest</div>
                    <StatelessRadioCheckboxField name={"orderBy"} onChange={onChange} value={"price desc"} checked={orderBy === "price desc"} />
                </div>
            </MixinPanel>
        </AbstractTooltipDefaultPanel>
    );
}
