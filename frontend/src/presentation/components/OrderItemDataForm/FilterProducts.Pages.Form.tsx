import IPresentationError from "../../interfaces/IPresentationError";
import FilterProductsFieldset, { FilterProductsFieldsetValueState } from "../Fieldsets/FilterProductFieldset";
import Divider from "../Resuables/Divider";
import MixinButton from "../Resuables/MixinButton";

export type FormPageValueState = FilterProductsFieldsetValueState;

export type FormPageErrorState = IPresentationError<{
    id: string[];
    name: string[];
    minPrice: string[];
    maxPrice: string[];
    description: string[];
    createdAfter: string[];
    createdBefore: string[];
}>;

export default function FormPage(props: { onReset: () => void; onSubmit: () => void; value: FormPageValueState; onChange: (value: FormPageValueState) => void }) {
    const { onReset, onSubmit, value, onChange } = props;

    return (
        <form
            className="flex flex-col gap-3"
            onReset={(e) => {
                e.preventDefault();
                onReset();
            }}
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            <div className="flex flex-col gap-3">
                <FilterProductsFieldset value={value} onChange={onChange} />
            </div>
            <Divider />
            <footer className="flex flex-row gap-3 justify-end shrink-0">
                <MixinButton className="overflow-hidden" options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="reset">
                    Reset
                </MixinButton>
                <MixinButton className="overflow-hidden" options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }} type="submit">
                    Submit
                </MixinButton>
            </footer>
        </form>
    );
}
