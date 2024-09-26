import FormField from "../Forms/FormField";
import StatelessCharField from "../StatelessFields/StatelessCharField";
import StatelessTextArea from "../StatelessFields/StatelessTextArea";

type ValueState = {
    id: string;
    name: string;
    minPrice: string;
    maxPrice: string;
    description: string;
    createdAfter: string;
    createdBefore: string;
};

export default function FilterProductFieldset(props: {
    data: ValueState;
    onChange: (field: keyof ValueState, value: ValueState[keyof ValueState]) => void;
}) {
    const { data, onChange } = props;

    return (
        <>
            <FormField name="name">
                <StatelessCharField
                    options={{
                        size: "mixin-char-input-base",
                        theme: "theme-input-generic-white",
                    }}
                    value={data.name}
                    onChange={(value) => onChange("name", value)}
                />
            </FormField>
            <div className="flex flex-row gap-2">
                <div className="basis-1/2">
                    <FormField name="minPrice">
                        <StatelessCharField
                            options={{
                                size: "mixin-char-input-base",
                                theme: "theme-input-generic-white",
                            }}
                            value={data.minPrice}
                            onChange={(value) => onChange("minPrice", value)}
                        />
                    </FormField>
                </div>
                <div className="basis-1/2">
                    <FormField name="maxPrice">
                        <StatelessCharField
                            options={{
                                size: "mixin-char-input-base",
                                theme: "theme-input-generic-white",
                            }}
                            value={data.maxPrice}
                            onChange={(value) => onChange("maxPrice", value)}
                        />
                    </FormField>
                </div>
            </div>
            <FormField name="description">
                <StatelessTextArea
                    onChange={(value) => onChange("description", value)}
                    value={data.description}
                    options={{
                        size: "mixin-textarea-any",
                        theme: "theme-textarea-generic-white",
                    }}
                    rows={5}
                    maxLength={1028}
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
        </>
    );
}
