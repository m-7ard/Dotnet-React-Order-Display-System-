import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import IPresentationError from "../../../interfaces/IPresentationError";
import useItemManager from "../../../hooks/useItemManager";
import { Type } from "@sinclair/typebox";
import typeboxToDomainCompatibleFormError from "../../../mappers/typeboxToDomainCompatibleFormError";
import validateTypeboxSchema from "../../../utils/validateTypeboxSchema";
import routeData from "../../../routes/_routeData";
import IOrderDataAccess from "../../../interfaces/dataAccess/IOrderDataAccess";
import CreateOrderPage from "./CreateOrder.Page";
import IProduct from "../../../../domain/models/IProduct";
import ICreateOrderRequestDTO from "../../../../infrastructure/contracts/orders/create/ICreateOrderRequestDTO";
import useResponseHandler from "../../../hooks/useResponseHandler";
import { err, ok } from "neverthrow";
import IPlainApiError from "../../../../infrastructure/interfaces/IPlainApiError";
import apiToDomainCompatibleFormError from "../../../mappers/apiToDomainCompatibleFormError";

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

interface ValueSchema {
    orderItemData: {
        [productId: number | string]: {
            product: IProduct;
            quantity: number;
        };
    };
}

type ErrorState = IPresentationError<{
    orderItemData: {
        [productId: number | string]: {
            productId: string[];
            quantity: string[];
        };
    };
}>;

const initialValues: ValueSchema = {
    orderItemData: {},
};

const initialErrors: ErrorState = {};

export default function CreateOrderController(props: { orderDataAccess: IOrderDataAccess }) {
    const { orderDataAccess } = props;
    const responseHandler = useResponseHandler();

    const itemManager = useItemManager<ValueSchema>(initialValues);
    const errorManager = useItemManager<ErrorState>(initialErrors);

    const navigate = useNavigate();
    const createOrderMutation = useMutation({
        mutationFn: async () => {

            const request: ICreateOrderRequestDTO = {
                ...itemManager.items,
                orderItemData: Object.entries(itemManager.items.orderItemData).reduce<ICreateOrderRequestDTO["orderItemData"]>((acc, [key, value]) => {
                    acc[key] = {
                        productId: value.product.id,
                        quantity: value.quantity,
                    };

                    return acc;
                }, {}),
            };

            const validation = validateTypeboxSchema(validatorSchema, request);

            if (validation.isErr()) {
            const errors = typeboxToDomainCompatibleFormError<ErrorState>(validation.error);
                errorManager.setAll(errors);
                return;
            }

            responseHandler({
                requestFn: () => orderDataAccess.createOrder(request),
                onResponseFn: async (response) => {
                    if (response.ok) {
                        navigate({ to: routeData.listOrders.build({}) });
                        return ok(undefined);
                    }
                    
                    if (response.status === 400) {
                        const errors: IPlainApiError = await response.json();
                        errorManager.setAll(apiToDomainCompatibleFormError(errors));
                        return ok(undefined);
                    }

                    return err(undefined);
                }
            })

        },
    });

    return (
        <CreateOrderPage
            onSubmit={createOrderMutation.mutate}
            onReset={() => {
                itemManager.setAll(initialValues);
                errorManager.setAll(initialErrors);
            }}
            onChange={(value) => {
                itemManager.setAll(value);
            }}
            errors={errorManager.items}
            value={itemManager.items}
        />
    );
}