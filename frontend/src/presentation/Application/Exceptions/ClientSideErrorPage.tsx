import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import { useRef } from "react";
import contentGridDirective from "../../directives/contentGridDirective";
import useRouterLoaderData from "../../hooks/useRouterLoaderData";

export default function ClientSideErrorPage() {
    const { error } = useRouterLoaderData((routes) => routes.CLIENT_SIDE_ERROR);
    const errorRef = useRef(error);

    console.error(errorRef.current);

    return (
        <MixinPage exp={(options) => ({ size: options.SIZE.BASE })} directives={[contentGridDirective(() => ({}))]} className={`flex flex-col items-center justify-center`}>
            <MixinPageSection className="text-4xl font-bold text-gray-800 text-center">A Client Side Error has Occured.</MixinPageSection>
            <MixinPageSection className="text-xl font-bold text-gray-700 text-center whitespace-pre">{errorRef.current.message}</MixinPageSection>
        </MixinPage>
    );
}
