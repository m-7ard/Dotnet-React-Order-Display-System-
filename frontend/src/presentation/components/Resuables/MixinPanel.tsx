import { ElementType, PropsWithChildren, PropsWithRef } from "react";
import PolymorphicProps from "../../types/PolymorphicProps";
import useDirectives from "../../hooks/useDirectives";
import panelSectionDirective from "../../directives/panelSectionDirective";
import Directive from "../../types/Directive";

/* 
    -----------------------------------------------------
    Common Panel Values 
    -----------------------------------------------------
*/
type TMixinPanelHostElementProps = React.JSX.IntrinsicAttributes & { className?: string };

type TMixinPanelHostConfig = {
    options: { size: "mixin-panel-base"; theme: "theme-panel-generic-white" };
    hasShadow?: boolean;
    hasBorder?: boolean;
    className?: string;
};

function useMixinPanelHostElementProps(config: TMixinPanelHostConfig, ...htmlAttrs: Array<Record<string, string>>): TMixinPanelHostElementProps {
    const { options, hasShadow = false, hasBorder = false, className = "" } = config;

    const shadowClass = hasShadow ? "token-default-shadow" : "";
    const borderClass = hasBorder ? "border token-default-border-color" : "";

    return {
        className: ["mixin-panel-like", options.size, options.theme, shadowClass, borderClass, className].join(" "),
        ...htmlAttrs,
    };
}

/* 
    -----------------------------------------------------
    Polymorphic Panel 
    -----------------------------------------------------
*/
type PolymorphicMixinPanelProps<E extends ElementType> = PolymorphicProps<E> & TMixinPanelHostConfig;

export function PolymorphicMixinPanel<T extends ElementType = "div">(props: PropsWithChildren<PolymorphicMixinPanelProps<T>>) {
    const { options, as, className, hasShadow = false, hasBorder = false, children, ...HTMLattrs } = props;
    const Component = as ?? "div";

    const hostElementProps: TMixinPanelHostElementProps = useMixinPanelHostElementProps({ options, className, hasShadow, hasBorder }, HTMLattrs);
    return <Component {...hostElementProps}>{children}</Component>;
}

/* 
    -----------------------------------------------------
    Render Panel 
    -----------------------------------------------------
*/
type RenderedMixinPanelProps = PropsWithRef<
    {
        children: (props: TMixinPanelHostElementProps) => React.ReactElement;
    } & TMixinPanelHostConfig
>;

export function RenderedMixinPanel(props: RenderedMixinPanelProps) {
    const { options, className = "", hasShadow = false, hasBorder = false, children } = props;
    const hostElementProps: TMixinPanelHostElementProps = useMixinPanelHostElementProps({ options, className, hasShadow, hasBorder });
    return children(hostElementProps);
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
