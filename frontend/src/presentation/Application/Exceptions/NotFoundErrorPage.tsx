import { useRouterState, Navigate } from "@tanstack/react-router";
import { CONTENT_GRID } from "../../attribute-mixins/contentGridTracks";
import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import routeData from "../../routes/_routeData";
import TanstackRouterState from "../../types/TanstackRouterState";
import { useRef } from "react";

export default function NotFoundErrorPage() {
    const state: TanstackRouterState = useRouterState();
    const errorRef = useRef(state.location.state.error);

    if (errorRef.current == null) {
        return (
            <Navigate
                to={routeData.clientSideError.pattern}
                state={(prev) => ({ ...prev, error: new Error("An 404 Not Found error occured but no error was provided to the NotFoundErrorPage.") })}
            />
        );
    }

    console.error(errorRef.current);

    return (
        <MixinPage
            options={{
                size: "mixin-page-base",
            }}
            className={`${CONTENT_GRID.CLASS} flex flex-col items-center justify-center`}
        >
            <MixinPageSection className="text-4xl font-bold text-gray-800 text-center">An 404 Not Found Error Occured.</MixinPageSection>
            <MixinPageSection className="text-xl font-bold text-gray-700 text-center whitespace-pre">{errorRef.current.message}</MixinPageSection>
        </MixinPage>
    );
}
