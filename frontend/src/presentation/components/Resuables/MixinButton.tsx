import { PropsWithChildren } from "react";

interface IMixinButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    options: {
        size: "mixin-button-sm" | "mixin-button-base",
        theme: "theme-button-generic-white" | "theme-button-generic-yellow" | "theme-button-generic-green"
    }
}

export default function MixinButton(props: PropsWithChildren<IMixinButtonProps>) {
    const { options, className, ...HTMLattrs } = props;
    return (
        <button className={["mixin-button-like", options.size, options.theme, className].join(" ")} {...HTMLattrs}>
            {props.children}
        </button>
    )
}