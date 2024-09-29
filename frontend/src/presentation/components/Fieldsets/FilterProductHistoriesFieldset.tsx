import FormField from "../Forms/FormField";
import StatelessCharField from "../StatelessFields/StatelessCharField";
import StatelessTextArea from "../StatelessFields/StatelessTextArea";

export type FilterProductHistoriesFieldsetValueState = {
    name: string;
    minPrice: string;
    maxPrice: string;
    description: string;
    validFrom: string;
    validTo: string;
    productId: string;
};

export default function FilterProductHistoriesFieldset(props: {
    data: FilterProductHistoriesFieldsetValueState;
    onChange: (
        field: keyof FilterProductHistoriesFieldsetValueState,
        value: FilterProductHistoriesFieldsetValueState[keyof FilterProductHistoriesFieldsetValueState],
    ) => void;
}) {
    const { data, onChange } = props;

    return (
        <>
            <FormField name="name">
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
                    <FormField name="minPrice">
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
                    <FormField name="maxPrice">
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
            <FormField name="description">
                {({ name }) => (
                    <StatelessTextArea
                        onChange={(value) => onChange(name, value)}
                        value={data[name]}
                        options={{
                            size: "mixin-textarea-any",
                            theme: "theme-textarea-generic-white",
                        }}
                        rows={5}
                        maxLength={1028}
                    />
                )}
            </FormField>
            <FormField name="validTo">
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
            <FormField name="validFrom">
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
        </>
    );
}
