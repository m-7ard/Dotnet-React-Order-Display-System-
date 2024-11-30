import { Type } from "@sinclair/typebox";
import IPresentationError from "../../../domain/models/IFormError";
import IProduct from "../../../domain/models/IProduct";
import CoverImage from "../Resuables/CoverImage";
import MixinButton from "../Resuables/MixinButton";
import StatelessCharField from "../StatelessFields/StatelessCharField";
import { Value } from "@sinclair/typebox/value";
import { getApiUrl } from "../../../viteUtils";

export type ValueSchema = {
    product: IProduct;
    quantity: number;
};

export type ErrorSchema = IPresentationError<{
    product: string[];
    quantity: string[];
}>;

export type OrderItemDataFormProps = {
    onUpdate: (value: ValueSchema) => void;
    onDelete: () => void;
    product: IProduct;
    errors?: ErrorSchema;
    value: ValueSchema;
};

export default function OrderItemDataFieldItem(props: OrderItemDataFormProps) {
    const { onUpdate, onDelete, product, value } = props;

    const updateQuantity = (quantity: number) => {
        const isValid = Value.Check(Type.Integer({ minimum: 1 }), quantity);
        const newValue = { ...value };
        newValue.quantity = isValid ? quantity : 1;
        onUpdate(newValue);
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
                <CoverImage
                    className="h-20 w-20 border border-gray-900 overflow-hidden shrink-0"
                    src={product.images[0] == null ? undefined : `${getApiUrl()}/Media/${product.images[0].fileName}`}
                />
                <div className="flex flex-col gap-px overflow-hidden">
                    <div className="text-sm font-bold truncate" title={product.name}>
                        {product.name}
                    </div>
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
