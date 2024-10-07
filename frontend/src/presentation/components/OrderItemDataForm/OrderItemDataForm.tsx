import { Type } from "@sinclair/typebox";
import IFormError from "../../../domain/models/IFormError";
import IProduct from "../../../domain/models/IProduct";
import CoverImage from "../Resuables/CoverImage";
import MixinButton from "../Resuables/MixinButton";
import StatelessCharField from "../StatelessFields/StatelessCharField";
import { Value } from "@sinclair/typebox/value";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../Resuables/MixinPrototypeCard";
import AbstractTooltip, { AbstractTooltipDefaultPanel, AbstractTooltipTrigger } from "../Resuables/AbstractTooltip";
import { getApiUrl } from "../../../viteUtils";

export type IOrderItemDataFormValue = {
    productId: number;
    quantity: number;
};

export type IOrderItemDataFormError = IFormError<{
    productId: string[];
    quantity: string[];
}>;

export default function OrderItemDataForm(props: {
    onUpdate: <T extends keyof IOrderItemDataFormValue>(fieldName: T, value: IOrderItemDataFormValue[T]) => void;
    onDelete: () => void;
    product: IProduct;
    errors?: IOrderItemDataFormError;
    value: IOrderItemDataFormValue;
}) {
    const { onUpdate, onDelete, product, value } = props;

    const updateQuantity = (quantity: number) => {
        const isValid = Value.Check(Type.Integer({ minimum: 1 }), quantity);
        onUpdate("quantity", isValid ? quantity : 1);
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
                <CoverImage
                    className="h-20 w-20 border border-gray-900 overflow-hidden"
                    src={product.images[0] == null ? undefined : `${getApiUrl()}/Media/${product.images[0].fileName}`}
                />
                <div className="flex flex-col gap-px">
                    <div className="text-sm font-bold">{product.name}</div>
                    <div className="text-sm">${product.price}</div>
                    <div className="mt-auto text-xs">{product.dateCreated.toLocaleString("en-us")}</div>
                </div>
            </div>
            <footer className="flex flex-row gap-2">
                <div className="flex flex-row gap-2 grow">
                    <MixinButton
                        options={{
                            size: "mixin-button-base",
                            theme: "theme-button-generic-green",
                        }}
                        type="button"
                        onClick={() => updateQuantity(value.quantity + 1)}
                    >
                        +
                    </MixinButton>
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={value.quantity.toString()}
                        onChange={(value) => updateQuantity(parseInt(value))}
                        className="flex grow"
                    />
                    <MixinButton
                        options={{
                            size: "mixin-button-base",
                            theme: "theme-button-generic-red",
                        }}
                        type="button"
                        onClick={() => updateQuantity(value.quantity - 1)}
                    >
                        -
                    </MixinButton>
                </div>
            </footer>
            <MixinButton
                className="justify-center w-full"
                type="button"
                onClick={onDelete}
                options={{ size: "mixin-button-base", theme: "theme-button-generic-red" }}
            >
                Remove Item
            </MixinButton>
        </div>
    );
}