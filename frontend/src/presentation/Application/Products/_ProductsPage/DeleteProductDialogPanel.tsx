import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import DeleteProductCommand from "../../../../application/commands/products/deleteProduct/DeleteProductCommand";
import apiToDomainCompatibleFormError from "../../../../application/mappers/apiToDomainCompatibleFormError";
import IProduct from "../../../../domain/models/IProduct";
import { AbstractDialogPanel } from "../../../components/Resuables/AbstractDialog";
import MixinButton from "../../../components/Resuables/MixinButton";
import { useAbstractDialogContext } from "../../../contexts/AbstractDialogContext";
import { useApplicationExceptionContext } from "../../../contexts/ApplicationExceptionHandlerContext";
import { useCommandDispatcherContext } from "../../../contexts/CommandDispatcherContext";

export default function DeleteProductDialogPanel(props: { product: IProduct }) {
    const { product } = props;
    const { onClose } = useAbstractDialogContext();

    const { commandDispatcher } = useCommandDispatcherContext();
    const { dispatchException } = useApplicationExceptionContext();

    const navigate = useNavigate();
    const deleteProductMutation = useMutation({
        mutationFn: async () => {
            const command = new DeleteProductCommand({
                id: product.id,
            });

            const result = await commandDispatcher.dispatch(command);

            if (result.isOk()) {
                navigate({ to: "/products" });
            } else if (result.error.type === "Exception") {
                dispatchException(result.error.data);
            } else if (result.error.type === "API") {
                const errors = apiToDomainCompatibleFormError(result.error.data);
                console.warn(errors);
                navigate({ to: "/products" });
            }
        },
    });

    return (
        <AbstractDialogPanel className="rounded shadow mixin-page-like mixin-page-base bg-gray-50 border border-gray-900 m-auto max-w-72">
            <header className="flex flex-row justify-between items-center">
                <div className="text-xl text-gray-900 font-bold">Confirm Deletion</div>
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
                    className="rounded shadow"
                    type="button"
                >
                    Close
                </MixinButton>
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <section className="flex flex-col gap-2 text-sm">
                Do you wish to delete "product #1"? This Process cannot be undone
            </section>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <footer className="flex flex-row gap-2">
                <MixinButton
                    onClick={onClose}
                    className="rounded shadow basis-1/2 justify-center"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                >
                    Cancel
                </MixinButton>
                <MixinButton
                    onClick={() => deleteProductMutation.mutate()}
                    className="rounded shadow basis-1/2 justify-center"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-red" }}
                >
                    Delete
                </MixinButton>
            </footer>
        </AbstractDialogPanel>
    );
}
