import { useRouterState } from "@tanstack/react-router";
import { CONTENT_GRID } from "../../attribute-mixins/contentGridTracks";
import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import TanstackRouterState from "../../types/TanstackRouterState";
import { useRef } from "react";

export default function ClientSideErrorPage() {
    const state: TanstackRouterState = useRouterState();
    const errorRef = useRef(state.location.state.error ?? new Error("A Client Side Error has occured, but no error was provided to the ClientSideErrorPage."));

    console.error(errorRef.current);

    return (
        <MixinPage
            options={{
                size: "mixin-page-base",
            }}
            className={`${CONTENT_GRID.CLASS} flex flex-col items-center justify-center`}
        >
            <MixinPageSection className="text-4xl font-bold text-gray-800 text-center">A Client Side Error has Occured.</MixinPageSection>
            <MixinPageSection className="text-xl font-bold text-gray-700 text-center">{errorRef.current.message}</MixinPageSection>
        </MixinPage>
    );
}
