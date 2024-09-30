import { Type } from "@sinclair/typebox";
import IFormError from "../../../domain/models/IFormError";
import IProduct from "../../../domain/models/IProduct";
import CoverImage from "../Resuables/CoverImage";
import MixinButton from "../Resuables/MixinButton";
import StatelessCharField from "../StatelessFields/StatelessCharField";
import { Value } from "@sinclair/typebox/value";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../Resuables/MixinPrototypeCard";
import AbstractTooltip, { AbstractTooltipDefaultPanel, AbstractTooltipTrigger } from "../Resuables/AbstractTooltip";

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
        <MixinPrototypeCard
            options={{
                size: "mixin-Pcard-base",
                theme: "theme-Pcard-generic-white",
            }}
        >
            <MixinPrototypeCardSection className="flex flex-row gap-2">
                <CoverImage
                    className="w-16 h-16 border border-gray-900  overflow-hidden"
                    src={
                        product.images[0] == null
                            ? undefined
                            : `${import.meta.env.VITE_API_URL}/Media/${product.images[0].fileName}`
                    }
                />
                <div className="flex flex-col gap-1 grow">
                    <div className="text-sm font-bold">{product.name}</div>
                    <div className="text-sm">${product.price}</div>
                    <div className="mt-auto text-xs">{product.dateCreated.toLocaleString("en-us")}</div>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-row gap-2 bg-gray-100">
                <AbstractTooltip
                    Trigger={({ open, onToggle }) => (
                        <AbstractTooltipTrigger>
                            <MixinButton
                                className=" "
                                options={{
                                    size: "mixin-button-sm",
                                    theme: "theme-button-generic-white",
                                }}
                                onClick={() => {
                                    onToggle();
                                }}
                                type="button"
                                active={open}
                            >
                                ...
                            </MixinButton>
                        </AbstractTooltipTrigger>
                    )}
                    Panel={<OrderItemDataFormOptionMenu onDelete={() => onDelete()} />}
                    positioning={{ top: "100%", left: "0px" }}
                />
                <div className="flex flex-row gap-2 grow">
                    <MixinButton
                        options={{
                            size: "mixin-button-sm",
                            theme: "theme-button-generic-green",
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
                            theme: "theme-button-generic-red",
                        }}
                        type="button"
                        onClick={() => updateQuantity(value.quantity - 1)}
                    >
                        -
                    </MixinButton>
                </div>
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}

function OrderItemDataFormOptionMenu(props: { onDelete: () => void }) {
    const { onDelete } = props;
    // const { onClose } = useAbstractTooltipContext();

    return (
        <AbstractTooltipDefaultPanel className={`z-10 fixed mt-1`}>
            <MixinPrototypeCard
                className="  "
                options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }}
            >
                <MixinPrototypeCardSection className="flex flex-col gap-2">
                    <MixinButton
                        className="justify-center w-full"
                        type="button"
                        onClick={onDelete}
                        options={{ size: "mixin-button-sm", theme: "theme-button-generic-red" }}
                    >
                        Remove Item
                    </MixinButton>
                </MixinPrototypeCardSection>
            </MixinPrototypeCard>
        </AbstractTooltipDefaultPanel>
    );
}
