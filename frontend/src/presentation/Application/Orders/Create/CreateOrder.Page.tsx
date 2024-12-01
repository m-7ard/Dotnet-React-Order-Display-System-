import IPresentationError from "../../../interfaces/IPresentationError";
import FormField from "../../../components/Forms/FormField";
import IProduct from "../../../../domain/models/IProduct";
import OrderItemDataField from "../../../components/OrderItemDataForm/OrderItemData.Field";
import MixinButton from "../../../components/Resuables/MixinButton";
import LinkBox from "../../../components/Resuables/LinkBox";
import routeData from "../../../routes/_routeData";
import { useCallback } from "react";

interface ValueSchema {
    orderItemData: {
        [productId: string | number]: {
            product: IProduct;
            quantity: number;
        };
    };
}

type ErrorState = IPresentationError<{
    orderItemData: {
        [productId: string | number]: {
            productId: string[];
            quantity: string[];
        };
    };
}>;

export default function CreateOrderPage(props: {
    onSubmit: () => void;
    onReset: () => void;
    onChange: (value: ValueSchema) => void;

    errors: ErrorState;
    value: ValueSchema;
}) {
    const { onSubmit, onReset, errors, value, onChange } = props;

    const updateField = useCallback(
        <T extends keyof ValueSchema>(fieldName: T, fieldValue: ValueSchema[T]) => {
            const newFormValue = { ...value };
            newFormValue[fieldName] = fieldValue;
            onChange(newFormValue);
        },
        [onChange, value],
    );

    return (
        <div className="mixin-page-like mixin-page-base mx-auto">
            <header className="flex flex-row gap-2 items-center">
                <LinkBox
                    parts={[
                        { isLink: true, to: routeData.listOrders.build({}), label: "Orders" },
                        { isLink: true, to: routeData.createOrder.build({}), label: "Create" },
                    ]}
                />
            </header>
            <hr className="h-0 w-full border-bottom border-gray-900"></hr>
            <form
                className="mixin-page-content-like mixin-page-content-base"
                onSubmit={async (e) => {
                    e.preventDefault();
                    onSubmit();
                }}
                onReset={(e) => {
                    e.preventDefault();
                    onReset();
                }}
            >
                <div className="flex flex-col gap-2">
                    <FormField name="orderItemData" errors={errors.orderItemData?._}>
                        <OrderItemDataField
                            value={value.orderItemData}
                            errors={errors.orderItemData}
                            onChange={(value) => {
                                updateField("orderItemData", value);
                            }}
                        />
                    </FormField>
                </div>
                <footer className="flex flex-row gap-2 justify-end">
                    <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="reset">
                        Reset
                    </MixinButton>
                    <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }} type="submit">
                        Submit
                    </MixinButton>
                </footer>
            </form>
        </div>
    );
}
