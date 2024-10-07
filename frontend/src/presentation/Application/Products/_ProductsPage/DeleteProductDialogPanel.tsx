import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import DeleteProductCommand from "../../../../application/commands/products/deleteProduct/DeleteProductCommand";
import apiToDomainCompatibleFormError from "../../../../application/mappers/apiToDomainCompatibleFormError";
import IProduct from "../../../../domain/models/IProduct";
import MixinButton from "../../../components/Resuables/MixinButton";
import { useApplicationExceptionContext } from "../../../contexts/ApplicationExceptionHandlerContext";
import { useCommandDispatcherContext } from "../../../contexts/CommandDispatcherContext";
import { useGlobalDialogPanelContext } from "../../../components/Dialog/GlobalDialogPanelContext";
import MixinPanel from "../../../components/Resuables/MixinPanel";
import LinkBox from "../../../components/Resuables/LinkBox";
import routeData from "../../../routes/_routeData";

export default function DeleteProductDialogPanel(props: { product: IProduct }) {
    const { product } = props;
    const { onClose } = useGlobalDialogPanelContext();

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
        <MixinPanel
            as="form"
            options={{
                size: "mixin-panel-base",
                theme: "theme-panel-generic-white",
            }}
            onSubmit={(e) => {
                e.preventDefault();
                deleteProductMutation.mutate();
                onClose();
            }}
        >
            <header className="flex flex-row justify-between items-center">
                <LinkBox
                    parts={[
                        { isLink: true, to: routeData.listProducts.build({}), label: "Products" },
                        { isLink: false, label: "Delete" },
                    ]}
                />
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
            <section className="flex flex-col gap-2 text-sm">
                Do you wish to delete "product #1"? This Process cannot be undone
            </section>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <footer className="flex flex-row gap-2">
                <MixinButton
                    onClick={onClose}
                    className="  basis-1/2 justify-center"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                    type="button"
                >
                    Cancel
                </MixinButton>
                <MixinButton
                    className="  basis-1/2 justify-center"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-red" }}
                    type="submit"
                >
                    Delete
                </MixinButton>
            </footer>
        </MixinPanel>
    );
}
