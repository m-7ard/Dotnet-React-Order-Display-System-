import { useLoaderData, useNavigate } from "@tanstack/react-router";
import MixinButton from "../../components/Resuables/MixinButton";
import { useApplicationExceptionContext } from "../../contexts/ApplicationExceptionHandlerContext";
import { useEffect } from "react";
import CoverImage from "../../components/Resuables/CoverImage";
import AbstractTooltip, {
    AbstractTooltipDefaultPanel,
    AbstractTooltipTrigger,
} from "../../components/Resuables/AbstractTooltip";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../components/Resuables/MixinPrototypeCard";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import LinkBox from "../../components/Resuables/LinkBox";
import IProductHistory from "../../../domain/models/IProductHistory";
import FilterProductHistoriesDialogPanel from "./_ProductHistories/FilterProductHistoriesDialogPanel";

export default function ProductHistoriesPage() {
    const { result } = useLoaderData({ from: "/product_histories" });
    const { dispatchException } = useApplicationExceptionContext();
    const productHistories = result.isOk() ? result.value.productHistories : [];

    useEffect(() => {
        if (result.isErr() && result.error.type === "Exception") {
            dispatchException(result.error.data);
        }
    }, [dispatchException, result]);

    return (
        <div className="mixin-page-like mixin-page-base mx-auto">
            <header className="flex flex-row gap-2 items-center">
                <LinkBox parts={[{ isLink: true, to: "/product_histories", label: "Product Histories" }]} />
                <div className="flex flex-row gap-2 ml-auto">
                    <GlobalDialog
                        zIndex={10}
                        Trigger={({ onToggle }) => (
                            <MixinButton
                                className="justify-center w-full basis-1/2"
                                options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                onClick={onToggle}
                            >
                                Filter
                            </MixinButton>
                        )}
                        Panel={FilterProductHistoriesDialogPanel}
                        panelProps={{}}
                    />
                </div>
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <section className="mixin-page-content-like mixin-page-content-base">
                {productHistories.map((productHistory) => (
                    <ProductHistory productHistory={productHistory} key={productHistory.id} />
                ))}
            </section>
        </div>
    );
}

function ProductHistory(props: { productHistory: IProductHistory }) {
    const { productHistory } = props;
    const productImages = productHistory.images.map((image) => `${import.meta.env.VITE_API_URL}/Media/${image}`);
    const navigate = useNavigate();

    return (
        <MixinPrototypeCard
            options={{
                size: "mixin-Pcard-base",
                theme: "theme-Pcard-generic-white",
            }}
        >
            <MixinPrototypeCardSection className="flex flex-row gap-2">
                <CoverImage
                    className="w-16 h-16 border border-gray-900 overflow-hidden"
                    src={productImages[0] == null ? undefined : productImages[0]}
                />
                <div className="flex flex-col gap-1 grow overflow-hidden">
                    <div className="text-sm font-bold truncate">{productHistory.name}</div>
                    <div className="text-sm">${productHistory.price}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-col">
                <div className="flex flex-row gap-2">
                    <div className="text-xs font-bold">Original Product Id</div>
                    <div className="text-xs">{productHistory.productId}</div>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="text-xs font-bold">Valid From</div>
                    <div className="text-xs">{productHistory.validFrom.toLocaleString("en-us")}</div>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="text-xs font-bold">Valid To</div>
                    <div className="text-xs">
                        {productHistory.validFrom > productHistory.validTo
                            ? "N/A"
                            : productHistory.validTo.toLocaleString("en-us")}
                    </div>
                </div>
            </MixinPrototypeCardSection>
            <footer className="flex flex-row gap-2 bg-gray-100" data-role="section">
                <a
                    className="w-full"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate({
                            to: `/orders`,
                            search: {
                                productHistoryId: productHistory.id,
                            },
                        });
                    }}
                >
                    <MixinButton
                        className="w-full justify-center  "
                        type="button"
                        options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }}
                    >
                        See Orders
                    </MixinButton>
                </a>
                <AbstractTooltip
                    Trigger={({ open, onToggle }) => (
                        <AbstractTooltipTrigger>
                            <MixinButton
                                className="justify-center  "
                                type="button"
                                options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                                onClick={onToggle}
                                active={open}
                            >
                                ...
                            </MixinButton>
                        </AbstractTooltipTrigger>
                    )}
                    Panel={<OptionMenu productHistory={productHistory} />}
                    positioning={{ top: "100%", right: "0px" }}
                />
            </footer>
        </MixinPrototypeCard>
    );
}

function OptionMenu(props: { productHistory: IProductHistory }) {
    const { productHistory } = props;
    const navigate = useNavigate();

    return (
        <AbstractTooltipDefaultPanel className={`z-10 fixed mt-1 shadow`}>
            <MixinPrototypeCard options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }}>
                <MixinPrototypeCardSection className="flex flex-col gap-2">
                    <a
                        className="w-full"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate({ to: "/products", search: { id: productHistory.productId } });
                        }}
                    >
                        <MixinButton
                            className="justify-center  "
                            type="button"
                            options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                        >
                            See Products
                        </MixinButton>
                    </a>
                </MixinPrototypeCardSection>
            </MixinPrototypeCard>
        </AbstractTooltipDefaultPanel>
    );
}
