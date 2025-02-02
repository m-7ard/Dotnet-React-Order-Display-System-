import { useRouterState } from "@tanstack/react-router";
import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import TanstackRouterState from "../../types/TanstackRouterState";
import { useRef } from "react";
import contentGridDirective from "../../directives/contentGridDirective";

export default function ClientSideErrorPage() {
    const state: TanstackRouterState = useRouterState();
    const errorRef = useRef(state.location.state.error ?? new Error("A Client Side Error has occured, but no error was provided to the ClientSideErrorPage."));

    console.error(errorRef.current);

    return (
        <MixinPage exp={(options) => ({ size: options.SIZE.BASE })} directives={[contentGridDirective(() => ({}))]} className={`flex flex-col items-center justify-center`}>
            <MixinPageSection className="text-4xl font-bold text-gray-800 text-center">A Client Side Error has Occured.</MixinPageSection>
            <MixinPageSection className="text-xl font-bold text-gray-700 text-center whitespace-pre">{errorRef.current.message}</MixinPageSection>
        </MixinPage>
    );
}
