import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import UploadImagesForm, { GeneratedFileName, OriginalFileName } from "../../../components/Forms/ImageUploadForm";
import IFormError from "../../../../domain/models/IFormError";
import useItemManager from "../../../hooks/useItemManager";
import StatelessCharField from "../../../components/StatelessCharField";
import { useCommandDispatcherContext } from "../../../contexts/CommandDispatcherContext";
import UploadProductImagesCommand from "../../../../application/commands/products/uploadProductImages/UploadProductImagesCommand";
import { useApplicationExceptionContext } from "../../../contexts/ApplicationExceptionHandlerContext";
import apiToDomainCompatibleFormError from "../../../../application/mappers/apiToDomainCompatibleFormError";
import CreateProductCommand from "../../../../application/commands/products/createProduct/CreateProductCommand";
import FormField from "../../../components/Forms/FormField";
import { Type } from "@sinclair/typebox";
import typeboxToDomainCompatibleFormError from "../../../../application/mappers/typeboxToDomainCompatibleFormError";
import StatelessTextArea from "../../../components/StatelessTextArea";
import validateTypeboxSchema from "../../../utils/validateTypeboxSchema";

const validatorSchema = Type.Object({
    name: Type.String({
        minLength: 1,
        maxLength: 255,
    }),
    description: Type.String({
        maxLength: 1028,
    }),
    price: Type.Number({
        minimum: 0.01,
        maximum: 10 ** 6,
    }),
    images: Type.Array(Type.String({ customPath: "/images/_" }), { maxItems: 8, suffixPath: "/_" }),
});

interface ValueState {
    name: string;
    description: string;
    price: string;
    images: Record<GeneratedFileName, OriginalFileName>;
}

type ErrorState = IFormError<{
    name: string[];
    images: Record<GeneratedFileName, string[]>;
    price: string[];
    description: string[];
}>;

const initialValueState: ValueState = {
    name: "",
    description: "",
    price: "",
    images: {},
};

const initialErrorState: ErrorState = {
    _: undefined,
    name: undefined,
    images: undefined,
    price: undefined,
    description: undefined
};

export default function CreateProductPage() {
    const { commandDispatcher } = useCommandDispatcherContext();
    const { dispatchException } = useApplicationExceptionContext();

    const itemManager = useItemManager<ValueState>(initialValueState);
    const errorManager = useItemManager<ErrorState>(initialErrorState);

    const navigate = useNavigate();
    const createProductMutation = useMutation({
        mutationFn: async () => {
            const validation = validateTypeboxSchema(validatorSchema, {
                name: itemManager.items.name,
                description: itemManager.items.description,
                price: parseFloat(itemManager.items.price),
                images: itemManager.items.images,
            });

            if (validation.isErr()) {
                errorManager.setAll(typeboxToDomainCompatibleFormError(validation.error));
                return;
            }

            const command = new CreateProductCommand({
                name: itemManager.items.name,
                description: itemManager.items.description,
                price: parseInt(itemManager.items.price),
                images: Object.keys(itemManager.items.images),
            });

            const result = await commandDispatcher.dispatch(command);

            if (result.isOk()) {
                navigate({ to: "/products" });
            } else if (result.error.type === "Exception") {
                dispatchException(result.error.data);
            } else if (result.error.type === "API") {
                const errors = apiToDomainCompatibleFormError<ErrorState>(result.error.data);
                errorManager.setAll(errors);
            }
        },
    });

    return (
        <form
            className="mixin-page-like mixin-page-base"
            onSubmit={async (e) => {
                e.preventDefault();
                errorManager.setAll(initialErrorState);
                await createProductMutation.mutateAsync();
            }}
            onReset={(e) => {
                e.preventDefault();
                errorManager.setAll(initialErrorState);
                itemManager.setAll(initialValueState);
            }}
        >
            <header className="text-2xl text-sky-600 font-medium">Create Product</header>
            <hr className="h-0 w-full border-bottom border-dashed border-gray-800"></hr>
            <div className="flex flex-col gap-2">
                <FormField name="name" errors={errorManager.items.name}>
                    <StatelessCharField
                        onChange={(value) => itemManager.updateItem("name", value)}
                        value={itemManager.items.name}
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                    />
                </FormField>
                <FormField name="images" errors={errorManager.items.images?._}>
                    <UploadImagesForm
                        onSubmit={async (files) => {
                            const ErrorState: string[] = [];

                            for (let i = 0; i < files.length; i++) {
                                const file = files[i];
                                const originalFileName = file.name as OriginalFileName;
                                const command = new UploadProductImagesCommand({ files: [file] });
                                const result = await commandDispatcher.dispatch(command);

                                if (result.isOk()) {
                                    const generatedFileName = result.value.images[0] as GeneratedFileName;
                                    itemManager.updateItem("images", (prev) => ({
                                        ...prev,
                                        [generatedFileName]: originalFileName,
                                    }));
                                } else if (result.error.type === "Exception") {
                                    dispatchException(result.error.data);
                                } else if (result.error.type === "API") {
                                    const uploadErrors = Object.values(
                                        apiToDomainCompatibleFormError<Record<GeneratedFileName, string[]>>(
                                            result.error.data,
                                        ),
                                    ).reduce((acc, cur) => [...acc, ...cur], []);
                                    ErrorState.push(...uploadErrors);
                                }
                            }

                            if (ErrorState.length > 0) {
                                errorManager.updateItem("images", {
                                    _: ErrorState,
                                });
                            }
                        }}
                        onDelete={(originalFileName) => {
                            itemManager.updateItem("images", (prev) => {
                                const newState = { ...prev };
                                delete newState[originalFileName];
                                return newState;
                            });
                        }}
                        errors={errorManager.items.images}
                        value={itemManager.items.images}
                    />
                </FormField>
                <FormField name="price" errors={errorManager.items.price}>
                    <StatelessCharField
                        onChange={(value) => itemManager.updateItem("price", value)}
                        value={itemManager.items.price.toString()}
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                    />
                </FormField>
                <FormField name="description" errors={errorManager.items.description}>
                    <StatelessTextArea
                        onChange={(value) => itemManager.updateItem("description", value)}
                        value={itemManager.items.description}
                        options={{
                            size: "mixin-textarea-any",
                            theme: "theme-textarea-generic-white",
                        }}
                        rows={5}
                        maxLength={1028}
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
