import { Navigate, useRouterState } from "@tanstack/react-router";
import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import ROUTE_DATA from "../../routes/ROUTE_DATA";
import TanstackRouterState from "../../types/TanstackRouterState";
import { useRef } from "react";
import contentGridDirective from "../../directives/contentGridDirective";

export default function InternalServerErrorPage() {
    const state: TanstackRouterState = useRouterState();
    const errorRef = useRef(state.location.state.error);

    if (errorRef.current == null) {
        return (
            <Navigate
                to={ROUTE_DATA.clientSideError.pattern}
                state={(prev) => ({ ...prev, error: new Error("A 500 Internal Server Error occured but no error was provided to the InternalServerErrorPage.") })}
            />
        );
    }

    console.error(errorRef.current);

    return (
        <MixinPage exp={(options) => ({ size: options.SIZE.BASE })} directives={[contentGridDirective(() => ({}))]} className={`flex flex-col items-center justify-center`}>
            <MixinPageSection className="text-4xl font-bold text-gray-800 text-center">An Internal Server Error Occured.</MixinPageSection>
            <MixinPageSection className="text-xl font-bold text-gray-700 text-center whitespace-pre">{errorRef.current.message}</MixinPageSection>
        </MixinPage>
    );
}
