import { ElementType, PropsWithChildren } from "react";
import PolymorphicProps from "../../types/PolymorphicProps";

type MixinPrototypeCardProps<E extends ElementType> = PolymorphicProps<E> & {
    options: {
        size: "mixin-Pcard-base";
        theme: "theme-Pcard-generic-white";
    };
    hasShadow?: boolean;
    hasBorder?: boolean;
    hasDivide?: boolean;
};

export default function MixinPrototypeCard<T extends ElementType = "div">(props: PropsWithChildren<MixinPrototypeCardProps<T>>) {
    const { options, as, className, hasShadow, hasBorder, hasDivide, ...HTMLattrs } = props;
    const Component = as ?? "div";

    const shadowClass = hasShadow == null ? "" : "token-default-shadow";
    const borderClass = hasBorder == null ? "" : "border token-default-border-color";
    const divideClass = hasDivide == null ? "" : "divide-y token-default-divide-color";

    return (
        <Component className={["mixin-Pcard-like", options.size, options.theme, className, shadowClass, borderClass, divideClass].join(" ")} {...HTMLattrs}>
            {props.children}
        </Component>
    );
}

type MixinPrototypeCardSectionProps<E extends ElementType> = PolymorphicProps<E> & {};

export function MixinPrototypeCardSection<T extends ElementType = "section">(props: PropsWithChildren<MixinPrototypeCardSectionProps<T>>) {
    const { as, className, ...HTMLattrs } = props;
    const Component = as ?? "section";

    return (
        <Component className={[className].join(" ")} {...HTMLattrs} data-role="Pcard-section">
            {props.children}
        </Component>
    );
}
