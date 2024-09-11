import { Type } from "@sinclair/typebox";
import IFormError from "../../../../domain/models/IFormError";
import IProduct from "../../../../domain/models/IProduct";
import CoverImage from "../../CoverImage";
import MixinButton from "../../MixinButton";
import StatelessCharField from "../../StatelessCharField";
import { Value } from "@sinclair/typebox/value";

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
    const { onUpdate, onDelete, product, errors, value } = props;

    const updateQuantity = (_value: number) => {
        const isValid = Value.Check(Type.Integer({ minimum: 1 }), _value);
        onUpdate("quantity", isValid ? parseInt(_value) : 1);
    };

    return (
        <div className="flex flex-col gap-1 p-1 border border-gray-400">
            <main className="flex flex-row gap-1">
                <section className="w-32 h-32 grid grid-cols-2 grid-rows-2 gap-0.5 shrink-0">
                    <CoverImage
                        className="row-span-1 col-span-1 border border-gray-400"
                        src={`${import.meta.env.VITE_API_URL}/Media/${product.images[0]?.fileName}`}
                    />
                    <CoverImage
                        className="row-span-1 col-span-1 border border-gray-400"
                        src={`${import.meta.env.VITE_API_URL}/Media/${product.images[1]?.fileName}`}
                    />
                    <CoverImage
                        className="row-span-1 col-span-1 border border-gray-400"
                        src={`${import.meta.env.VITE_API_URL}/Media/${product.images[2]?.fileName}`}
                    />
                    <CoverImage
                        className="row-span-1 col-span-1 border border-gray-400"
                        src={`${import.meta.env.VITE_API_URL}/Media/${product.images[3]?.fileName}`}
                    />
                </section>
                <section className="flex flex-col grow gap-1 overflow-hidden">
                    <header className="p-1 overflow-hidden p-1">
                        <div className="text-xs text-gray-600 leading-none">#{product.id}</div>
                        <div className="text-sm font-medium leading-none line-clamp-4 break-words">{product.name}</div>
                    </header>
                    <footer className="flex flex-row gap-1 mt-auto">
                        <MixinButton
                            options={{
                                size: "mixin-button-sm",
                                theme: "theme-button-generic-white",
                            }}
                            type="button"
                            onClick={() => updateQuantity(value.quantity + 1)}
                        >
                            +
                        </MixinButton>
                        <StatelessCharField
                            options={{
                                size: "mixin-char-input-sm",
                                theme: "theme-input-generic-white",
                            }}
                            value={value.quantity.toString()}
                            onChange={(value) => updateQuantity(parseInt(value))}
                            className="flex grow"
                        />
                        <MixinButton
                            options={{
                                size: "mixin-button-sm",
                                theme: "theme-button-generic-white",
                            }}
                            type="button"
                            onClick={() => updateQuantity(value.quantity - 1)}
                        >
                            -
                        </MixinButton>
                    </footer>
                </section>
            </main>
            <footer>
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    className="text-sm"
                    onClick={onDelete}
                    type="button"
                >
                    Remove Item
                </MixinButton>
            </footer>
        </div>
    );
}
