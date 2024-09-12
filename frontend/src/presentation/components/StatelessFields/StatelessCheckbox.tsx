type IStatelessCheckboxProps = {
    value: boolean;
    onChange: (value: boolean) => void;
}

function StatelessCheckbox (props: IStatelessCheckboxProps) {
    const { value, onChange } = props;

    return (
        <div className={["mixin-checkbox-like mixin-checkbox-sm theme-checkbox-generic-white"].join(" ")}>
            <input
                type="checkbox"
                checked={value ?? false}
                onChange={({ target: { checked } }) => {
                    onChange(checked);
                }}
            ></input>
        </div>
    );
}

export default StatelessCheckbox;
