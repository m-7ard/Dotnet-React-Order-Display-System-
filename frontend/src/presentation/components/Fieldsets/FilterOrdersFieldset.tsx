import OrderStatus from "../../../domain/valueObjects/Order/OrderStatus";
import FormField from "../Forms/FormField";
import StatelessCharField from "../StatelessFields/StatelessCharField";
import StatelessListBox from "../StatelessFields/StatelessListBox";

export type FilterOrdersFieldsetValueState = {
    id: string;
    minTotal: string;
    maxTotal: string;
    status: string;
    createdBefore: string;
    createdAfter: string;
    productId: string;
};

export default function FilterOrdersFieldset(props: {
    data: FilterOrdersFieldsetValueState;
    onChange: (field: keyof FilterOrdersFieldsetValueState, value: FilterOrdersFieldsetValueState[keyof FilterOrdersFieldsetValueState]) => void;
}) {
    const { data, onChange } = props;

    return (
        <>
            <FormField name="id">
                <StatelessCharField
                    options={{
                        size: "mixin-char-input-base",
                        theme: "theme-input-generic-white",
                    }}
                    value={data.id}
                    onChange={(value) => onChange("id", value)}
                />
            </FormField>
            <div className="flex flex-row gap-2">
                <div className="basis-1/2">
                    <FormField name="minTotal">
                        <StatelessCharField
                            options={{
                                size: "mixin-char-input-base",
                                theme: "theme-input-generic-white",
                            }}
                            value={data.minTotal}
                            onChange={(value) => onChange("minTotal", value)}
                        />
                    </FormField>
                </div>
                <div className="basis-1/2">
                    <FormField name="maxTotal">
                        <StatelessCharField
                            options={{
                                size: "mixin-char-input-base",
                                theme: "theme-input-generic-white",
                            }}
                            value={data.maxTotal}
                            onChange={(value) => onChange("maxTotal", value)}
                        />
                    </FormField>
                </div>
            </div>
            <FormField name="status">
                <StatelessListBox
                    nullable
                    onChange={(value) => {
                        onChange("status", value == null ? "" : value.toString());
                    }}
                    value={data.maxTotal}
                    choices={[
                        {
                            value: OrderStatus.FINISHED.value,
                            label: OrderStatus.FINISHED.value,
                        },
                        {
                            value: OrderStatus.PENDING.value,
                            label: OrderStatus.PENDING.value,
                        },
                    ]}
                />
            </FormField>
            <FormField name="createdBefore">
                <StatelessCharField
                    options={{
                        size: "mixin-char-input-base",
                        theme: "theme-input-generic-white",
                    }}
                    value={data.createdBefore}
                    type="date"
                    onChange={(value) => onChange("createdBefore", value)}
                />
            </FormField>
            <FormField name="createdAfter">
                <StatelessCharField
                    options={{
                        size: "mixin-char-input-base",
                        theme: "theme-input-generic-white",
                    }}
                    value={data.createdAfter}
                    type="date"
                    onChange={(value) => onChange("createdAfter", value)}
                />
            </FormField>
            <FormField name="productId">
                <StatelessCharField
                    options={{
                        size: "mixin-char-input-base",
                        theme: "theme-input-generic-white",
                    }}
                    value={data.productId}
                    onChange={(value) => onChange("productId", value)}
                />
            </FormField>
        </>
    );
}
