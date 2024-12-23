import { ElementType, PropsWithChildren } from "react";
import PolymorphicProps from "../../types/PolymorphicProps";
import { CONTENT_GRID } from "../../attribute-mixins/contentGridTracks";

type MixinPageProps<E extends ElementType> = PolymorphicProps<E> & {};

export default function MixinContentGrid<T extends ElementType = "div">(props: PropsWithChildren<MixinPageProps<T>>) {
    const { as, className, children, ...HTMLattrs } = props;
    const Component = as ?? "div";

    return (
        <Component className={[CONTENT_GRID.CLASSES, className].join(" ")} {...HTMLattrs}>
            {children}
        </Component>
    );
}

type MixinContentGridTrackProps<E extends ElementType> = PolymorphicProps<E> & {
    track: keyof (typeof CONTENT_GRID)["TRACKS"];
};

export function MixinContentGridTrack<T extends ElementType = "div">(props: PropsWithChildren<MixinContentGridTrackProps<T>>) {
    const { as, className, children, track, ...HTMLattrs } = props;
    const Component = as ?? "div";

    return (
        <Component className={[className].join(" ")} {...CONTENT_GRID.TRACKS[track]} {...HTMLattrs}>
            {children}
        </Component>
    );
}
