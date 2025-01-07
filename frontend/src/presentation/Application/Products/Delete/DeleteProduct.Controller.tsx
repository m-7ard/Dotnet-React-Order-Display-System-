import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import IProduct from "../../../../domain/models/IProduct";
import useResponseHandler from "../../../hooks/useResponseHandler";
import IPlainApiError from "../../../../infrastructure/interfaces/IPlainApiError";
import { err, ok } from "neverthrow";
import useItemManager from "../../../hooks/useItemManager";
import IPresentationError from "../../../interfaces/IPresentationError";
import DeleteProductDialogPanel from "./DeleteProduct.DialogPanel";
import IProductDataAccess from "../../../interfaces/dataAccess/IProductDataAccess";
import PresentationErrorFactory from "../../../mappers/PresentationErrorFactory";

export type DeleteProductErrorSchema = IPresentationError<unknown>;

export default function DeleteProductController(props: { product: IProduct; productDataAccess: IProductDataAccess; onClose: () => void }) {
    const { product, productDataAccess, onClose } = props;
    const responseHandler = useResponseHandler();
    const navigate = useNavigate();

    const errorManager = useItemManager<DeleteProductErrorSchema>({});

    const deleteProductMutation = useMutation({
        mutationFn: async () => {
            await responseHandler({
                requestFn: () => productDataAccess.deleteProduct({ id: product.id }),
                onResponseFn: async (response) => {
                    if (response.ok) {
                        navigate({ to: "/products" });
                        onClose();
                        return ok(undefined);
                    }

                    const errors: IPlainApiError[] = await response.json();
                    errorManager.setAll(PresentationErrorFactory.ApiErrorsToPresentationErrors(errors));
                    return err(undefined);
                },
            });
        },
    });

    return (
        <DeleteProductDialogPanel
            product={product}
            onSubmit={deleteProductMutation.mutate}
            errors={errorManager.items}
            onClose={() => {
                errorManager.setAll({});
                onClose();
            }}
        />
    );
}
