import { Type } from "@sinclair/typebox";
import IPresentationError from "../../interfaces/IPresentationError";
import IProduct from "../../../domain/models/IProduct";
import CoverImage from "../Resuables/CoverImage";
import MixinButton from "../Resuables/MixinButton";
import StatelessCharField from "../StatelessFields/StatelessCharField";
import { Value } from "@sinclair/typebox/value";
import { getApiUrl } from "../../../viteUtils";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../Resuables/MixinPrototypeCard";

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
    const { onUpdate, onDelete, product, value, errors } = props;

    const updateQuantity = (quantity: number) => {
        const isValid = Value.Check(Type.Integer({ minimum: 1 }), quantity);
        const newValue = { ...value };
        newValue.quantity = isValid ? quantity : 1;
        onUpdate(newValue);
    };

    return (
        <MixinPrototypeCard options={{
            size: "mixin-Pcard-base",
            theme: "theme-Pcard-generic-white"
        }}>
            <MixinPrototypeCardSection className="flex flex-row gap-2">
                <CoverImage
                    className="basis-1/3 aspect-square border border-gray-900 overflow-hidden shrink-0"
                    src={product.images[0] == null ? undefined : `${getApiUrl()}/Media/${product.images[0].fileName}`}
                />
                 <div className="flex flex-col gap-px overflow-hidden">
                    <div className="overflow-hidden">
                        <div className="text-xs font-bold">Name</div>
                        <div className="text-sm truncate" title={product.name}>
                            {product.name}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-bold">Price</div>
                        <div className="text-sm truncate">${product.price}</div>
                    </div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-row gap-2">
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
            </MixinPrototypeCardSection>
            {errors == null ? null : (
                <MixinPrototypeCardSection className="flex flex-col gap-2">
                    <ul>
                        {Object.values(errors).reduce((acc, errors) => [...acc, ...errors], []).map((error) => (
                            <li className="text-xs">
                                \&bull {error}             
                            </li>
                        ))}
                    </ul>   
                </MixinPrototypeCardSection>
            )}
            <MixinPrototypeCardSection>
                <MixinButton
                    className="justify-center w-full"
                    type="button"
                    onClick={onDelete}
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-red" }}
                >
                    Remove Item
                </MixinButton>
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
