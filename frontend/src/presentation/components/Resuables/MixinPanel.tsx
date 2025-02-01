import { ElementType, HTMLAttributes, PropsWithChildren, PropsWithRef } from "react";
import PolymorphicProps from "../../types/PolymorphicProps";
import useDirectives from "../../hooks/useDirectives";
import panelSectionDirective from "../../directives/panelSectionDirective";
import Directive from "../../types/Directive";
import panelDirective, { PanelDirectiveExpression } from "../../directives/panelDirective";
import useDirectivesAsAttrs from "../../hooks/useDirectivesAsAttrs";

/* 
    -----------------------------------------------------
    Polymorphic Panel 
    -----------------------------------------------------
*/
type PolymorphicMixinPanelProps<E extends ElementType> = PolymorphicProps<E> & {
    exp: PanelDirectiveExpression;
};

export function PolymorphicMixinPanel<T extends ElementType = "div">(props: PropsWithChildren<PolymorphicMixinPanelProps<T>>) {
    const { as, className = "", children, exp, ...HTMLattrs } = props;
    const Component = as ?? "div";

    const attrs = useDirectivesAsAttrs({ attrs: HTMLattrs, classNames: [className] }, [panelDirective(exp)]);

    return <Component {...attrs}>{children}</Component>;
}

/* 
    -----------------------------------------------------
    Render Panel 
    -----------------------------------------------------
*/
type RenderedMixinPanelProps = PropsWithRef<{
    children: (props: HTMLAttributes<HTMLElement>) => React.ReactElement;
    exp: PanelDirectiveExpression;
    className?: string;
}>;

export function RenderedMixinPanel(props: RenderedMixinPanelProps) {
    const { className = "", exp, children } = props;
    const attrs = useDirectivesAsAttrs({ attrs: {}, classNames: [className] }, [panelDirective(exp)]);
    return children(attrs);
}

// -----------------------------------------------------
// -----------------------------------------------------
// -----------------------------------------------------
// -----------------------------------------------------

/* 
    -----------------------------------------------------
    Render Section 
    -----------------------------------------------------
*/
type TRenderedMixinPanelSectionProps = { className?: string };
type RenderedMixinPanelSectionProps = { children: (props: TRenderedMixinPanelSectionProps) => void; className?: string; directives: Array<Directive> };

export function RenderedMixinPanelSection(props: RenderedMixinPanelSectionProps) {
    const { children, className = "", ...htmlAttrs } = props;
    const directiveData = useDirectives({ attrs: htmlAttrs, classNames: [className] }, [panelSectionDirective()]);
    return children({ className: directiveData.classNames.join(" "), ...directiveData.attrs });
}

type PolymorphicMixinPanelSectionProps<E extends ElementType> = PolymorphicProps<E> & TRenderedMixinPanelSectionProps;

export function PolymorphicMixinPanelSection<T extends ElementType = "section">(props: PropsWithChildren<PolymorphicMixinPanelSectionProps<T>>) {
    const { as, className = "", children, ...HTMLattrs } = props;
    const Component = as ?? "section";
    const directiveData = useDirectives({ attrs: HTMLattrs, classNames: [className] }, [panelSectionDirective()]);

    return (
        <Component className={directiveData.classNames.join(" ")} {...directiveData.attrs}>
            {children}
        </Component>
    );
}
