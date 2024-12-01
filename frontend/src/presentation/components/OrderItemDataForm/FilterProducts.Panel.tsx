import { useMutation } from "@tanstack/react-query";
import IProduct from "../../../domain/models/IProduct";
import useItemManager from "../../hooks/useItemManager";
import MixinButton from "../Resuables/MixinButton";
import { useState } from "react";
import { useGlobalDialogPanelContext } from "../Dialog/GlobalDialog.Panel.Context";
import LinkBox from "../Resuables/LinkBox";
import MixinPanel from "../Resuables/MixinPanel";
import productMapper from "../../../infrastructure/mappers/productMapper";
import IListProductsResponseDTO from "../../../infrastructure/contracts/products/list/IListProductsResponseDTO";
import { productDataAccess } from "../../deps/dataAccess";
import FormPage, { FormPageErrorState, FormPageValueState } from "./FilterProducts.Pages.Form";
import ResultsPage from "./FilterProducts.Pages.Results";
import CountTrackerProduct from "./FilterProducts.Results.CountTracker";
import useDefaultErrorHandling from "../../hooks/useResponseHandler";
import { err, ok } from "neverthrow";
import parseListProductsCommandParameters from "../../../infrastructure/parsers/parseListProductsCommandParameters";
import { ValueSchema as ItemValueSchema } from "./OrderItemData.Field.Item";
import apiToDomainCompatibleFormError from "../../mappers/apiToDomainCompatibleFormError";
import IPlainApiError from "../../../infrastructure/interfaces/IPlainApiError";

const FORM_PAGE_INITIAL_DATA = {
    id: "",
    name: "",
    minPrice: "",
    maxPrice: "",
    description: "",
    createdAfter: "",
    createdBefore: "",
};

export type FilterProductsPanelProps = {
    orderItems: {
        [productId: number | string]: ItemValueSchema;
    };
    onAdd: (product: IProduct) => void;
};

export default function FilterProductsPanel(props: FilterProductsPanelProps) {
    const responseHandler = useDefaultErrorHandling();
    const { onAdd, orderItems } = props;
    const { onClose } = useGlobalDialogPanelContext();

    const [route, setRoute] = useState<"form" | "result">("form");

    const formValue = useItemManager<FormPageValueState>(FORM_PAGE_INITIAL_DATA);
    const formErrors = useItemManager<FormPageErrorState>({});

    const searchProductsMutation = useMutation({
        mutationFn: async () => {
            const parsedParams = parseListProductsCommandParameters(formValue.items);
            return await responseHandler({
                requestFn: () => productDataAccess.listProducts(parsedParams),
                onResponseFn: async (response) => {
                    if (response.ok) {
                        setRoute("result");
                        const data: IListProductsResponseDTO = await response.json();
                        const products = data.products.map(productMapper.apiToDomain);
                        return ok(products);
                    } else if (response.status === 400) {
                        const errors: IPlainApiError = await response.json();
                        formErrors.setAll(apiToDomainCompatibleFormError(errors));
                        return ok(undefined);
                    }

                    return err(undefined);
                },
                fallbackValue: undefined,
            });
        },
    });

    const searchResults = searchProductsMutation.data ?? [];

    return (
        <MixinPanel
            options={{
                size: "mixin-panel-base",
                theme: "theme-panel-generic-white",
            }}
            className="overflow-auto"
        >
            <header className="flex flex-row gap-2 items-center justify-between">
                <LinkBox
                    parts={[
                        { isLink: false, label: "Products" },
                        { isLink: false, label: "Filter" },
                    ]}
                />
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
                    className=" "
                >
                    Close
                </MixinButton>
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <nav className="flex flex-row gap-2">
                <MixinButton
                    options={{
                        size: "mixin-button-base",
                        theme: "theme-button-generic-white",
                    }}
                    type="button"
                    onClick={() => setRoute("form")}
                    active={route === "form"}
                    className="basis-1/2 justify-center"
                >
                    Form
                </MixinButton>
                <MixinButton
                    options={{
                        size: "mixin-button-base",
                        theme: "theme-button-generic-white",
                    }}
                    type="button"
                    onClick={() => setRoute("result")}
                    active={route === "result"}
                    className="basis-1/2 justify-center"
                >
                    Results
                </MixinButton>
            </nav>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            {
                {
                    form: <FormPage onReset={() => formValue.setAll(FORM_PAGE_INITIAL_DATA)} onSubmit={searchProductsMutation.mutate} value={formValue.items} onChange={(value) => formValue.setAll(value)} />,
                    result: (
                        <ResultsPage
                            ControlComponent={CountTrackerProduct}
                            results={searchResults.map((result) => {
                                const product = Object.prototype.hasOwnProperty.call(orderItems, result.id) ? orderItems[result.id] : null;

                                return {
                                    onAdd: () => onAdd(result),
                                    product: result,
                                    quantity: product?.quantity ?? 0,
                                    isAdded: product != null,
                                };
                            })}
                        />
                    ),
                }[route]
            }
        </MixinPanel>
    );
}
