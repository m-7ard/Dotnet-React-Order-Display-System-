import { ElementType, PropsWithChildren } from "react";
import PolymorphicProps from "../../types/PolymorphicProps";

type MixinPanelProps<E extends ElementType> = PolymorphicProps<E> & {
    options: {
        size: "mixin-panel-base";
        theme: "theme-panel-generic-white";
    };
};

export default function MixinPanel<T extends ElementType = "div">(props: PropsWithChildren<MixinPanelProps<T>>) {
    const { options, as, className, ...HTMLattrs } = props;
    const Component = as ?? "div";

    return (
        <Component className={["mixin-panel-like", options.size, options.theme, className].join(" ")} {...HTMLattrs}>
            {props.children}
        </Component>
    );
}

type MixinPanelSectionProps<E extends ElementType> = PolymorphicProps<E> & {};

export function MixinPanelSectionSection<T extends ElementType = "section">(
    props: PropsWithChildren<MixinPanelSectionProps<T>>,
) {
    const { as, className, ...HTMLattrs } = props;
    const Component = as ?? "div";

    return (
        <Component className={[className].join(" ")} {...HTMLattrs} data-role="section">
            {props.children}
        </Component>
    );
}
