import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router";
import MixinButton from "../../components/Resuables/MixinButton";
import { useApplicationExceptionContext } from "../../contexts/ApplicationExceptionHandlerContext";
import { useCallback, useEffect } from "react";
import CoverImage from "../../components/Resuables/CoverImage";
import AbstractTooltip, {
    AbstractTooltipDefaultPanel,
    AbstractTooltipTrigger,
} from "../../components/Resuables/AbstractTooltip";
import GlobalDialog from "../../components/Dialog/GlobalDialog";
import LinkBox from "../../components/Resuables/LinkBox";
import IProductHistory from "../../../domain/models/IProductHistory";
import FilterProductHistoriesDialogPanel from "./_ProductHistories/FilterProductHistoriesDialogPanel";
import { getApiUrl } from "../../../viteUtils";
import MixinPanel from "../../components/Resuables/MixinPanel";
import { useAbstractTooltipContext } from "../../contexts/AbstractTooltipContext";
import routeData from "../../routes/_routeData";
import StatelessRadioCheckboxField from "../../components/StatelessFields/StatelessRadioCheckboxField";

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
            <header className="flex flex-row gap-2 items-center overflow-x-auto shrink-0">
                <LinkBox
                    parts={[{ isLink: true, to: routeData.listProductHistories.build({}), label: "Product Histories" }]}
                />
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
                    <AbstractTooltip
                        Trigger={({ onToggle, open }) => (
                            <AbstractTooltipTrigger>
                                <MixinButton
                                    className="w-full truncate"
                                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                                    onClick={onToggle}
                                    active={open}
                                >
                                    Order By
                                </MixinButton>
                            </AbstractTooltipTrigger>
                        )}
                        Panel={<OrderByMenu />}
                        positioning={{ top: "100%", right: "0px" }}
                    />
                </div>
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <section className="grid grid-cols-2 max-[576px]:grid-cols-2 max-[425px]:grid-cols-1 gap-x-2 gap-y-4">
                {productHistories.map((productHistory) => (
                    <ProductHistory productHistory={productHistory} key={productHistory.id} />
                ))}
            </section>
        </div>
    );
}

function ProductHistory(props: { productHistory: IProductHistory }) {
    const { productHistory } = props;
    const productImages = productHistory.images.map((image) => `${getApiUrl()}/Media/${image}`);
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
                <CoverImage
                    className="aspect-square basis-1/3 border border-gray-900 overflow-hidden shrink-0"
                    src={productImages[0] == null ? undefined : productImages[0]}
                />
                <div className="flex flex-col gap-1 grow overflow-hidden">
                    <div className="text-sm font-bold truncate" title={productHistory.name}>{productHistory.name}</div>
                    <div className="text-sm">${productHistory.price}</div>
                </div>
            </div>
            <div>
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
            </div>
            <footer className="flex flex-col gap-2 bg-gray-100">
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
                                className="justify-center w-full"
                                type="button"
                                options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                                onClick={onToggle}
                                active={open}
                            >
                                More
                            </MixinButton>
                        </AbstractTooltipTrigger>
                    )}
                    Panel={<OptionMenu productHistory={productHistory} />}
                    positioning={{ top: "100%", right: "0px", left: "0px" }}
                />
            </footer>
        </div>
    );
}

function OptionMenu(props: { productHistory: IProductHistory }) {
    const { productHistory } = props;
    const navigate = useNavigate();
    const { onClose } = useAbstractTooltipContext();

    return (
        <AbstractTooltipDefaultPanel className={`z-10 fixed mt-1`}>
            <MixinPanel
                options={{
                    size: "mixin-panel-base",
                    theme: "theme-panel-generic-white",
                }}
            >
                <header className="flex flex-row items-center justify-between">
                    <div className="text-sm">Other Options</div>
                    <MixinButton
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-white",
                        }}
                        onClick={onClose}
                        className=" "
                        type="button"
                    >
                        Close
                    </MixinButton>
                </header>
                <hr className="h-0 w-full border-bottom border-gray-900"></hr>
                <div className="flex flex-col gap-2">
                    <a
                        className="w-full"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate({ to: "/products", search: { id: productHistory.productId } });
                        }}
                    >
                        <MixinButton
                            className="justify-center w-full"
                            type="button"
                            options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                        >
                            See Products
                        </MixinButton>
                    </a>
                </div>
            </MixinPanel>
        </AbstractTooltipDefaultPanel>
    );
}

function OrderByMenu() {
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
            >
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <div className="text-sm">Newest</div>
                        <StatelessRadioCheckboxField
                            name={"orderBy"}
                            onChange={onChange}
                            value={"newest"}
                            checked={orderBy === "newest"}
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <div className="text-sm">Oldest</div>
                        <StatelessRadioCheckboxField
                            name={"orderBy"}
                            onChange={onChange}
                            value={"oldest"}
                            checked={orderBy === "oldest"}
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <div className="text-sm">Price - Lowest to Highest</div>
                        <StatelessRadioCheckboxField
                            name={"orderBy"}
                            onChange={onChange}
                            value={"price asc"}
                            checked={orderBy === "price asc"}
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <div className="text-sm">Product Id - Highest to Lowest</div>
                        <StatelessRadioCheckboxField
                            name={"orderBy"}
                            onChange={onChange}
                            value={"product id desc"}
                            checked={orderBy === "product id desc"}
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <div className="text-sm">Product Id - Highest to Lowest</div>
                        <StatelessRadioCheckboxField
                            name={"orderBy"}
                            onChange={onChange}
                            value={"product id asc"}
                            checked={orderBy === "product id asc"}
                        />
                    </div>
                </div>
            </MixinPanel>
        </AbstractTooltipDefaultPanel>
    );
}
