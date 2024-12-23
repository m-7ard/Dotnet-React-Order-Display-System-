import { PropsWithChildren } from "react";

interface IMixinButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    options: {
        size: "mixin-button-sm" | "mixin-button-base";
        theme?: "theme-button-generic-white" | "theme-button-generic-yellow" | "theme-button-generic-green" | "theme-button-generic-red";
    };
    isStatic?: boolean;
    active?: boolean;
    hasShadow?: boolean;
}

export default function MixinButton(props: PropsWithChildren<IMixinButtonProps>) {
    const { options, active, className, isStatic, hasShadow, ...HTMLattrs } = props;
    const isActive = active ?? false;
    const staticMixinClass = isStatic == null ? "" : "mixin-button-like--static";
    const staticThemeClass = isStatic == null ? "" : `${options.theme}--static`;
    const hasShadowClass = hasShadow == null ? "" : `shadow`;

    return (
        <button data-active={isActive} className={["mixin-button-like", options.size, options.theme, className, staticMixinClass, staticThemeClass, hasShadowClass].join(" ")} {...HTMLattrs}>
            {props.children}
        </button>
    );
}
