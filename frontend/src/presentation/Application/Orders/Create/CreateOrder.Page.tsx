import IPresentationError from "../../../interfaces/IPresentationError";
import FormField from "../../../components/Forms/FormField";
import IProduct from "../../../../domain/models/IProduct";
import OrderItemDataField from "../../../components/OrderItemDataForm/OrderItemData.Field";
import MixinButton from "../../../components/Resuables/MixinButton";
import LinkBox from "../../../components/Resuables/LinkBox";
import routeData from "../../../routes/_routeData";
import { useCallback } from "react";
import contentGridTracks from "../../../attribute-mixins/contentGridTracks";
import pageSection from "../../../attribute-mixins/pageSection";
import Divider from "../../../components/Resuables/Divider";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../../components/Resuables/MixinPrototypeCard";

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
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                onSubmit();
            }}
            onReset={(e) => {
                e.preventDefault();
                onReset();
            }}
            className="mixin-page-like mixin-page-base mixin-content-grid"
        >
            <header className="flex flex-row gap-2 items-center" {...pageSection} {...contentGridTracks.base}>
                <LinkBox
                    parts={[
                        { isLink: true, to: routeData.listOrders.build({}), label: "Orders" },
                        { isLink: true, to: routeData.createOrder.build({}), label: "Create" },
                    ]}
                />
            </header>
            <Divider {...contentGridTracks.base} />
            {errors._ == null ? null : (
                <section {...pageSection} {...contentGridTracks.base}>
                    <MixinPrototypeCard
                        options={{
                            size: "mixin-Pcard-base",
                            theme: "theme-Pcard-generic-white",
                        }}
                        hasBorder
                        hasDivide
                    >
                        <MixinPrototypeCardSection>
                            <div className="token-card--header--primary-text">Failed to Create Order</div>
                            <div className="token-card--header--secondary-text">Form Errors</div>
                        </MixinPrototypeCardSection>
                        <MixinPrototypeCardSection>
                            {errors._.map((error) => (
                                <div className="text-sm">&bull; {error}</div>
                            ))}
                        </MixinPrototypeCardSection>
                    </MixinPrototypeCard>
                </section>
            )}
            <section {...pageSection} {...contentGridTracks.base}>
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
            </section>
            <Divider {...contentGridTracks.base} />
            <footer className="flex flex-row gap-2 justify-end" {...pageSection} {...contentGridTracks.base}>
                <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="reset">
                    Reset
                </MixinButton>
                <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }} type="submit">
                    Submit
                </MixinButton>
            </footer>
        </form>
    );
}
