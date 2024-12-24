import { useMutation } from "@tanstack/react-query";
import IProduct from "../../../domain/models/IProduct";
import useItemManager from "../../hooks/useItemManager";
import React, { useCallback, useState } from "react";
import productMapper from "../../../infrastructure/mappers/productMapper";
import IListProductsResponseDTO from "../../../infrastructure/contracts/products/list/IListProductsResponseDTO";
import { productDataAccess } from "../../deps/dataAccess";
import { FormPageErrorState, FormPageValueState } from "./FilterProductResults.Pages.Form";
import useDefaultErrorHandling from "../../hooks/useResponseHandler";
import { err, ok } from "neverthrow";
import parseListProductsRequestDTO from "../../../infrastructure/parsers/parseListProductsRequestDTO";
import apiToDomainCompatibleFormError from "../../mappers/apiToDomainCompatibleFormError";
import IPlainApiError from "../../../infrastructure/interfaces/IPlainApiError";
import FilterProductResults from "./FilterProductResults";

const FORM_PAGE_INITIAL_DATA = {
    id: "",
    name: "",
    minPrice: "",
    maxPrice: "",
    description: "",
    createdAfter: "",
    createdBefore: "",
};

export default function FilterProductResultsController(props: { getResults: (searchResults: IProduct[]) => Array<React.ReactNode> }) {
    const { getResults } = props;
    const responseHandler = useDefaultErrorHandling();
    const [route, setRoute] = useState<"form" | "result">("form");
    const changeRoute = useCallback((newRoute: "form" | "result") => setRoute(newRoute), []);

    const formValue = useItemManager<FormPageValueState>(FORM_PAGE_INITIAL_DATA);
    const formErrors = useItemManager<FormPageErrorState>({});

    const searchProductsMutation = useMutation({
        mutationFn: async () => {
            const parsedParams = parseListProductsRequestDTO(formValue.items);
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
        <FilterProductResults
            resultComponents={getResults(searchResults)}
            route={route}
            changeRoute={changeRoute}
            form={{
                onChange: formValue.setAll,
                errors: formErrors.items,
                onReset: () => formValue.setAll(FORM_PAGE_INITIAL_DATA),
                onSubmit: () => searchProductsMutation.mutate(),
                value: formValue.items,
            }}
        />
    );
}
