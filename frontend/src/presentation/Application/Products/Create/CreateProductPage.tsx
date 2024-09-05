import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import UploadImagesForm, { GeneratedFileName, OriginalFileName } from "../../../components/ImageUploadForm";
import IFormError from "../../../../domain/models/IFormError";
import useItemManager from "../../../hooks/useItemManager";
import StatelessCharField from "../../../components/StatelessCharField";
import { useCommandDispatcherContext } from "../../../contexts/CommandDispatcherContext";
import UploadProductImagesCommand from "../../../../application/commands/products/uploadProductImages/UploadProductImagesCommand";
import { useApplicationExceptionContext } from "../../../contexts/ApplicationExceptionHandlerContext";
import apiToDomainCompatibleFormError from "../../../../application/mappers/apiToDomainCompatibleFormError";
import CreateProductCommand from "../../../../application/commands/products/createProduct/CreateProductCommand";
import FormField from "../../../components/Forms/FormField";

interface State {
    name: string;
    description: string;
    price: number;
    images: Record<GeneratedFileName, OriginalFileName>;
}

type FormErrors = IFormError<{
    name: string[];
    images: Record<GeneratedFileName, string[]>;
}>

const initialState: State = {
    name: "",
    description: "",
    price: 0,
    images: {}
};

export default function MenuItemsCreatePage() {
    const itemManager = useItemManager<State>(initialState);
    const { commandDispatcher } = useCommandDispatcherContext();
    const { dispatchException } = useApplicationExceptionContext();
    const errorManager = useItemManager<FormErrors>({
        _: undefined,
        name: undefined,
        images: undefined
    });

    const navigate = useNavigate();
    const createMenuItemMutation = useMutation({
        mutationFn: async () => {
            const command = new CreateProductCommand({
                name: itemManager.items.name,
                description: itemManager.items.description,
                price: itemManager.items.price,
                images: Object.values(itemManager.items.images),
            });
            const result = await commandDispatcher.dispatch(command);

            errorManager.setAll({
                _: undefined,
                name: undefined,
                images: undefined
            });

            if (result.isOk()) {
                navigate({ to: "/products" });
            } else if (result.error.type === "Exception") {
                dispatchException(result.error.data);
            } else if (result.error.type === "API") {
                const errors = apiToDomainCompatibleFormError<FormErrors>(result.error.data);
                errorManager.setAll(errors);
            }
        },
    });

    return (
        <form
            className="mixin-page-like mixin-page-base"
            onSubmit={async (e) => {
                e.preventDefault();
                await createMenuItemMutation.mutateAsync();
            }}
            onReset={(e) => {
                e.preventDefault();
                itemManager.setAll(initialState);
            }}
        >
            <header className="text-2xl text-sky-600 font-medium">Create Menu Item</header>
            <hr className="h-0 w-full border-bottom border-dashed border-gray-800"></hr>
            <div className="flex flex-col gap-2">
                <FormField name="name" errors={errorManager.items.name} >
                    <StatelessCharField 
                        onChange={(value) => itemManager.updateItem("name", value)}
                        value={itemManager.items.name}
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white"
                        }}
                    />
                </FormField>
                <FormField name="images" errors={errorManager.items.images?._} >
                    <UploadImagesForm 
                        onSubmit={async (files) => {
                            const formErrors: string[] = [];

                            for (let i = 0; i < files.length; i++) {
                                const file = files[i];
                                const originalFileName = file.name as OriginalFileName;
                                const command = new UploadProductImagesCommand({ files: [file] });
                                const result = await commandDispatcher.dispatch(command);
                
                                if (result.isOk()) {
                                    const generatedFileName = result.value.images[0] as GeneratedFileName;
                                    itemManager.updateItem("images", (prev) => ({
                                        ...prev,
                                        [generatedFileName]: originalFileName
                                    }))
                                } else if (result.error.type === "Exception") {
                                    dispatchException(result.error.data);
                                } else if (result.error.type === "API") {
                                    const uploadErrors = Object.values(apiToDomainCompatibleFormError<Record<string, string[]>>(result.error.data))
                                        .reduce((acc, cur) => [...acc, ...cur], [])
                                    formErrors.push(...uploadErrors);
                                }
                            }

                            if (formErrors.length > 0) {
                                errorManager.updateItem("images", {
                                    "_": formErrors
                                });
                            }
                        }}
                        onDelete={(originalFileName) => {
                            itemManager.updateItem("images", (prev) => {
                                const newState = { ...prev };
                                delete newState[originalFileName];
                                return newState;
                            })
                        }}
                        errors={errorManager.items.images}
                        value={itemManager.items.images}
                    />
                </FormField>
            </div>
            <footer className="flex flex-row gap-x-2 justify-end">
                <button className="mixin-button-like mixin-button-base theme-button-generic-white" type="reset">
                    Reset
                </button>
                <button className="mixin-button-like mixin-button-base theme-button-generic-green" type="submit">
                    Submit
                </button>
            </footer>
        </form>
    );
}
