import { Type } from "@sinclair/typebox";
import IFormError from "../../../../domain/models/IFormError";
import IProduct from "../../../../domain/models/IProduct";
import CoverImage from "../../Resuables/CoverImage";
import MixinButton from "../../Resuables/MixinButton";
import StatelessCharField from "../../StatelessFields/StatelessCharField";
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

    const updateQuantity = (quantity: number) => {
        const isValid = Value.Check(Type.Integer({ minimum: 1 }), quantity);
        onUpdate("quantity", isValid ? quantity : 1);
    };

    return (
        <div className="mixin-Pcard-like mixin-Pcard-base theme-Pcard-generic-white rounded shadow">
            <section className="w-full grid grid-cols-4 grid-rows-1 shrink-0 gap-1" data-role="section">
                {Array.from({ length: 4 }).map((_, i) => (
                    <CoverImage
                        className="row-span-1 col-span-1 aspect-square border border-gray-300 rounded shadow overflow-hidden"
                        src={
                            product.images[i]?.fileName == null
                                ? undefined
                                : `${import.meta.env.VITE_API_URL}/Media/${product.images[i]?.fileName}`
                        }
                        key={i}
                    />
                ))}
            </section>
            <main className="flex flex-col gap-1" data-role="section">
                <div className="font-bold text-sm">{product.name}</div>
                <div className="p-0.5 px-2 bg-gray-900 text-white font-bold rounded shadow w-fit text-sm">
                    ${product.price}
                </div>
                <div className="flex flex-row gap-2 items-center text-xs ">
                    <div>Date Created:</div>
                    <div>{product.dateCreated.toLocaleDateString("en-us")}</div>
                </div>
            </main>
            <footer className="flex flex-row gap-4" data-role="section">
                <MixinButton
                    className="rounded shadow"
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onDelete}
                    type="button"
                >
                    ...
                </MixinButton>
                <div className="flex flex-row gap-2 grow">
                    <MixinButton
                        className="shadow rounded"
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
                        className="shadow rounded"
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-white",
                        }}
                        type="button"
                        onClick={() => updateQuantity(value.quantity - 1)}
                    >
                        -
                    </MixinButton>
                </div>
            </footer>
        </div>
    );
}
