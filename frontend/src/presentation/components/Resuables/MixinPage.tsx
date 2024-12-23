import { ElementType, PropsWithChildren } from "react";
import PolymorphicProps from "../../types/PolymorphicProps";
import pageSection from "../../attribute-mixins/pageSection";

type MixinPageProps<E extends ElementType> = PolymorphicProps<E> & {
    options: {
        size: "mixin-page-base";
    };
};

export default function MixinPage<T extends ElementType = "div">(props: PropsWithChildren<MixinPageProps<T>>) {
    const { options, as, className, children, ...HTMLattrs } = props;
    const Component = as ?? "div";

    return (
        <Component className={["mixin-page-like", options.size, className].join(" ")} {...HTMLattrs}>
            {children}
        </Component>
    );
}

type MixinPageSectionProps<E extends ElementType> = PolymorphicProps<E> & {};

export function MixinPageSection<T extends ElementType = "section">(props: PropsWithChildren<MixinPageSectionProps<T>>) {
    const { as, className, children, ...HTMLattrs } = props;
    const Component = as ?? "section";

    return (
        <Component className={[className].join(" ")} {...HTMLattrs} {...pageSection}>
            {children}
        </Component>
    );
}
