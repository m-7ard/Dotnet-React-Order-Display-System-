import { ElementType, PropsWithChildren } from "react";
import PolymorphicProps from "../../types/PolymorphicProps";

type MixinPrototypeCardProps<E extends ElementType> = PolymorphicProps<E> & {
    options: {
        size: "mixin-Pcard-base";
        theme: "theme-Pcard-generic-white";
    };
};

export default function MixinPrototypeCard<T extends ElementType = "div">(
    props: PropsWithChildren<MixinPrototypeCardProps<T>>,
) {
    const { options, as, className, ...HTMLattrs } = props;
    const Component = as ?? "div";

    return (
        <Component className={["mixin-Pcard-like", options.size, options.theme, className].join(" ")} {...HTMLattrs}>
            {props.children}
        </Component>
    );
}

type MixinPrototypeCardSectionProps<E extends ElementType> = PolymorphicProps<E> & {};

export function MixinPrototypeCardSection<T extends ElementType = "section">(
    props: PropsWithChildren<MixinPrototypeCardSectionProps<T>>,
) {
    const { as, className, ...HTMLattrs } = props;
    const Component = as ?? "section";

    return (
        <Component className={[className].join(" ")} {...HTMLattrs} data-role="Pcard-section">
            {props.children}
        </Component>
    );
}
