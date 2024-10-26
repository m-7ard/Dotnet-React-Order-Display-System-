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
    productHistoryId: string;
};

export default function FilterOrdersFieldset(props: {
    data: FilterOrdersFieldsetValueState;
    onChange: (
        field: keyof FilterOrdersFieldsetValueState,
        value: FilterOrdersFieldsetValueState[keyof FilterOrdersFieldsetValueState],
    ) => void;
}) {
    const { data, onChange } = props;

    return (
        <>
            <FormField name="id">
                {({ name }) => (
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={data[name]}
                        onChange={(value) => onChange(name, value)}
                    />
                )}
            </FormField>
            <div className="flex flex-row gap-2">
                <div className="basis-1/2">
                    <FormField name="minTotal">
                        {({ name }) => (
                            <StatelessCharField
                                options={{
                                    size: "mixin-char-input-base",
                                    theme: "theme-input-generic-white",
                                }}
                                value={data[name]}
                                onChange={(value) => onChange(name, value)}
                            />
                        )}
                    </FormField>
                </div>
                <div className="basis-1/2">
                    <FormField name="maxTotal">
                        {({ name }) => (
                            <StatelessCharField
                                options={{
                                    size: "mixin-char-input-base",
                                    theme: "theme-input-generic-white",
                                }}
                                value={data[name]}
                                onChange={(value) => onChange(name, value)}
                            />
                        )}
                    </FormField>
                </div>
            </div>
            <FormField name="status">
                {({ name }) => (
                    <StatelessListBox
                        nullable
                        onChange={(value) => {
                            onChange(name, value == null ? "" : value.toString());
                        }}
                        value={data[name]}
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
                )}
            </FormField>
            <FormField name="createdBefore">
                {({ name }) => (
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={data[name]}
                        type="date"
                        onChange={(value) => onChange(name, value)}
                    />
                )}
            </FormField>
            <FormField name="createdAfter">
                {({ name }) => (
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={data[name]}
                        type="date"
                        onChange={(value) => onChange(name, value)}
                    />
                )}
            </FormField>
            <FormField name="productId">
                {({ name }) => (
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={data[name]}
                        onChange={(value) => onChange(name, value)}
                    />
                )}
            </FormField>
            <FormField name="productHistoryId">
                {({ name }) => (
                    <StatelessCharField
                        options={{
                            size: "mixin-char-input-base",
                            theme: "theme-input-generic-white",
                        }}
                        value={data[name]}
                        onChange={(value) => onChange(name, value)}
                    />
                )}
            </FormField>
        </>
    );
}
