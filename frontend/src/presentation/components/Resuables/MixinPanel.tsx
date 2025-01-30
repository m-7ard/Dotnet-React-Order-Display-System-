import { ElementType, PropsWithChildren } from "react";
import PolymorphicProps from "../../types/PolymorphicProps";

type MixinPanelProps<E extends ElementType> = PolymorphicProps<E> & {
    options: {
        size: "mixin-panel-base";
        theme: "theme-panel-generic-white";
    };
    hasShadow?: boolean;
    hasBorder?: boolean;
};

export default function MixinPanel<T extends ElementType = "div">(props: PropsWithChildren<MixinPanelProps<T>>) {
    const { options, as, className, hasShadow = false, hasBorder = false, children, ...HTMLattrs } = props;
    const Component = as ?? "div";

    const shadowClass = hasShadow ? "token-default-shadow" : "";
    const borderClass = hasBorder ? "border token-default-border-color" : "";

    return (
        <Component className={["mixin-panel-like", options.size, options.theme, className, shadowClass, borderClass].join(" ")} {...HTMLattrs}>
            {children}
        </Component>
    );
}

type MixinPanelSectionProps<E extends ElementType> = PolymorphicProps<E> & {};

export function MixinPanelSection<T extends ElementType = "section">(props: PropsWithChildren<MixinPanelSectionProps<T>>) {
    const { as, className, children, ...HTMLattrs } = props;
    const Component = as ?? "section";

    return (
        <Component className={[className].join(" ")} {...HTMLattrs} data-role="panel-section">
            {children}
        </Component>
    );
}

