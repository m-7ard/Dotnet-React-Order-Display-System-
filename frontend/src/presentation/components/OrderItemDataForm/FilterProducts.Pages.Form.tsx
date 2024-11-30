import { useCallback } from "react";
import IPresentationError from "../../../domain/models/IFormError";
import FilterProductsFieldset, { FilterProductsFieldsetValueState } from "../Fieldsets/FilterProductFieldset";
import MixinButton from "../Resuables/MixinButton";

export type FormPageValueState = FilterProductsFieldsetValueState;

export type FormPageErrorState = IPresentationError<{
    id: string[],
    name: string[],
    minPrice: string[],
    maxPrice: string[],
    description: string[],
    createdAfter: string[],
    createdBefore: string[],
}>;

export default function FormPage(props: {
    onReset: () => void;
    onSubmit: () => void;
    value: FormPageValueState;
    onChange: (value: FormPageValueState) => void;
}) {
    const { onReset, onSubmit, value, onChange } = props;

    const updateField = useCallback(<T extends keyof FormPageValueState>(fieldName: T, fieldValue: FormPageValueState[T]) => {
        const newFormValue = { ...value };
        newFormValue[fieldName] = fieldValue;
        onChange(newFormValue);
    }, [onChange, value])

    return (
        <form
            className="flex flex-col gap-[inherit]"
            onReset={(e) => {
                e.preventDefault();
                onReset();
            }}
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            <div className="flex flex-col gap-2">
                <FilterProductsFieldset
                    data={value}
                    onChange={(field, value) => updateField(field, value)}
                />
            </div>
            <footer className="flex flex-row gap-2 justify-end shrink-0">
                <MixinButton
                    className="overflow-hidden"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                    type="reset"
                >
                    Reset
                </MixinButton>
                <MixinButton
                    className="overflow-hidden"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }}
                    type="submit"
                >
                    Submit
                </MixinButton>
            </footer>
        </form>
    );
}
