import { ElementType, PropsWithChildren } from "react";


type IMixinPrototypeCardProps<T extends React.ElementType> = {
    options: {
        size: "mixin-Pcard-base"
        theme: "theme-Pcard-generic-white"
    };
    as?: T;
} & React.ComponentProps<T>

type IMixinPrototypeCardSectionProps<T extends React.ElementType> = {
    as?: T;
} & React.ComponentProps<T>

export default function MixinPrototypeCard<T extends ElementType = 'div'>(props: PropsWithChildren<IMixinPrototypeCardProps<T>>) {
    const { options, as, className, ...HTMLattrs } = props;
    const Component = as ?? 'div';

    return (
        <Component className={["mixin-Pcard-like", options.size, options.theme, className].join(" ")} {...HTMLattrs}>
            {props.children}
        </Component>
    )
}

export function MixinPrototypeCardSection<T extends ElementType = 'section'>(props: PropsWithChildren<IMixinPrototypeCardSectionProps<T>>) {
    const { as, className, ...HTMLattrs } = props;
    const Component = as ?? 'section';

    return (
        <Component className={[className].join(" ")} {...HTMLattrs} data-role="section">
            {props.children}
        </Component>
    )
}