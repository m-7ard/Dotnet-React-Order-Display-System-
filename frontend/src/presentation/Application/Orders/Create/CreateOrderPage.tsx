import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import IFormError from "../../../../domain/models/IFormError";
import useItemManager from "../../../hooks/useItemManager";
import { useCommandDispatcherContext } from "../../../contexts/CommandDispatcherContext";
import { useApplicationExceptionContext } from "../../../contexts/ApplicationExceptionHandlerContext";
import apiToDomainCompatibleFormError from "../../../../application/mappers/apiToDomainCompatibleFormError";
import FormField from "../../../components/Forms/FormField";
import { Type } from "@sinclair/typebox";
import typeboxToDomainCompatibleFormError from "../../../../application/mappers/typeboxToDomainCompatibleFormError";
import validateTypeboxSchema from "../../../utils/validateTypeboxSchema";
import CreateOrderCommand from "../../../../application/commands/orders/createOrder/CreateOrderCommand";
import IProduct from "../../../../domain/models/IProduct";
import OrderItemDataFormManager from "../../../components/OrderItemDataForm/OrderItemDataFormManager";
import { IOrderItemDataFormValue } from "../../../components/OrderItemDataForm/OrderItemDataForm";
import MixinButton from "../../../components/Resuables/MixinButton";
import Linkbox from "../../../components/Resuables/LinkBox";

const validatorSchema = Type.Object({
    orderItemData: Type.Record(
        Type.String(),
        Type.Object({
            productId: Type.Number({ minimum: 1 }),
            quantity: Type.Number({ minimum: 1 }),
        }),
        { minProperties: 1, suffixPath: "/_" },
    ),
});

interface ValueState {
    orderItemData: {
        [UID: string]: IOrderItemDataFormValue;
    };
}

type ErrorState = IFormError<{
    orderItemData: {
        [UID: string]: {
            productId: string[];
            quantity: string[];
        };
    };
}>;

const initialValueState: ValueState = {
    orderItemData: {},
};

const initialErrorState: ErrorState = {
    _: undefined,
    orderItemData: undefined,
};

export default function CreateOrderPage() {
    const { commandDispatcher } = useCommandDispatcherContext();
    const { dispatchException } = useApplicationExceptionContext();

    const itemManager = useItemManager<ValueState>(initialValueState);
    const errorManager = useItemManager<ErrorState>(initialErrorState);

    const navigate = useNavigate();
    const createOrderMutation = useMutation({
        mutationFn: async () => {
            const validation = validateTypeboxSchema(validatorSchema, {
                orderItemData: itemManager.items.orderItemData,
            });

            if (validation.isErr()) {
                const errors = typeboxToDomainCompatibleFormError<ErrorState>(validation.error);
                errorManager.setAll(errors);
                return;
            }

            const command = new CreateOrderCommand({
                orderItemData: itemManager.items.orderItemData,
            });

            const result = await commandDispatcher.dispatch(command);

            if (result.isOk()) {
                navigate({ to: "/orders" });
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
                await createOrderMutation.mutateAsync();
            }}
            onReset={(e) => {
                e.preventDefault();
                errorManager.setAll(initialErrorState);
                itemManager.setAll(initialValueState);
            }}
        >
            <header className="flex flex-row gap-2 items-center">
                <Linkbox
                    parts={[
                        { isLink: true, to: "/orders", label: "Orders" },
                        { isLink: true, to: "/orders/create", label: "Create" },
                    ]}
                />
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <div className="flex flex-col gap-2">
                <FormField name="orderItemData" errors={errorManager.items.orderItemData?._}>
                    <OrderItemDataFormManager
                        onDelete={(UID) => {
                            itemManager.updateItem("orderItemData", (prev) => {
                                const newState = { ...prev };
                                delete newState[UID];
                                return newState;
                            });
                        }}
                        value={itemManager.items.orderItemData}
                        onAdd={(product: IProduct) => {
                            itemManager.updateItem("orderItemData", (prev) => {
                                const newState = { ...prev };
                                const UID = crypto.randomUUID();
                                newState[UID] = {
                                    productId: product.id,
                                    quantity: 1,
                                };
                                return newState;
                            });
                        }}
                        errors={errorManager.items.orderItemData}
                        onUpdate={(UID, value) => {
                            itemManager.updateItem("orderItemData", (prev) => {
                                const newState = { ...prev };
                                newState[UID] = value;
                                return newState;
                            });
                        }}
                    />
                </FormField>
            </div>
            <footer className="flex flex-row gap-2">
                <MixinButton
                    className="  overflow-hidden basis-1/2 justify-center"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                    type="reset"
                >
                    Reset
                </MixinButton>
                <MixinButton
                    className="  overflow-hidden basis-1/2 justify-center"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }}
                    type="submit"
                >
                    Submit
                </MixinButton>
            </footer>
        </form>
    );
}
