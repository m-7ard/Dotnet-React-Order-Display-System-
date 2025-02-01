import { ElementType, PropsWithChildren } from "react";
import PolymorphicProps from "../../types/PolymorphicProps";
import pageSection from "../../attribute-mixins/pageSection";
import useDirectivesAsAttrs from "../../hooks/useDirectivesAsAttrs";
import pageDirective, { PageDirectiveExpression } from "../../directives/pageDirective";
import DirectiveFn from "../../types/DirectiveFn";

type MixinPageProps<E extends ElementType> = PolymorphicProps<E> & {
    exp: PageDirectiveExpression;
    directives?: Array<DirectiveFn>;
};

export default function MixinPage<T extends ElementType = "div">(props: PropsWithChildren<MixinPageProps<T>>) {
    const { exp, as, className = "", children, directives=[], ...HTMLattrs } = props;
    const Component = as ?? "div";

    const hostAttributes = useDirectivesAsAttrs({ attrs: HTMLattrs, classNames: [className] }, [pageDirective(exp), ...directives]);

    return (
        <Component {...hostAttributes}>
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
