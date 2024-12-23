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
    const { options, as, className, hasShadow, hasBorder, ...HTMLattrs } = props;
    const Component = as ?? "div";

    const shadowClass = hasShadow == null ? "" : "token-default-shadow";
    const borderClass = hasBorder == null ? "" : "border token-default-border-color";

    return (
        <Component className={["mixin-panel-like", options.size, options.theme, className, shadowClass, borderClass].join(" ")} {...HTMLattrs}>
            {props.children}
        </Component>
    );
}
