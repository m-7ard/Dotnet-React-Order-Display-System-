import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import { useRef } from "react";
import contentGridDirective from "../../directives/contentGridDirective";
import useRouterLoaderData from "../../hooks/useRouterLoaderData";

export default function LoaderErrorPage() {
    const {error} = useRouterLoaderData((routes) => routes.LOADER_ERROR);
    const errorRef = useRef(error);

    console.error(errorRef.current);

    return (
        <MixinPage exp={(options) => ({ size: options.SIZE.BASE })} directives={[contentGridDirective(() => ({}))]} className={`flex flex-col items-center justify-center`}>
            <MixinPageSection className="text-4xl font-bold text-gray-800 text-center">An Error Occured While Loading the Page's Data.</MixinPageSection>
            <MixinPageSection className="text-xl font-bold text-gray-700 text-center whitespace-pre">{errorRef.current.message}</MixinPageSection>
        </MixinPage>
    );
}
