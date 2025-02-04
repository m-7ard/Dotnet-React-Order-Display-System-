import React from "react";
import MixinButton from "./MixinButton";
import ROUTE_DATA, { RouteHierarchy } from "../../routes/ROUTE_DATA";
import { Link } from "@tanstack/react-router";
import ROUTE_KEYS, {  TRouteKeys } from "../../routes/ROUTE_KEYS";

export default function LinkBoxV2<K extends keyof TRouteKeys>({ exp, routeParams }: { exp: (keys: TRouteKeys) => TRouteKeys[K]; routeParams: Parameters<>}) {
    const parts: Array<{
        label: string;
        url: string | null;
    }> = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let currentRoute: RouteHierarchy<any, any, any> | undefined = exp(ROUTE_DATA);

    while (currentRoute != null) {
        const { label } = currentRoute;

        if (label != null) {
            let partLabel: string;
            let partUrl: string | null = null;

            if (label[0] === "$") {
                // Replace the $... label with the url parameter value
                const urlParameterKey = label.slice(1);
                const urlParameterValue = routeParams[urlParameterKey];

                if (urlParameterKey == null) {
                    throw new Error(
                        `No matching url parameter was found for the url parameter "${urlParameterKey}" for the route label of route "${currentRoute.pattern}". To fix this make sure that the label matches the url parameter at the time of RouteData creation.`,
                    );
                }

                partLabel = urlParameterValue;
                partUrl = currentRoute.build(routeParams);
            } else {
                partLabel = label;
                partUrl = pattern;
            }

            if (currentRoute.isLayout) {
                parts.push({ label: partLabel, url: null });
            } else {
                parts.push({ label: partLabel, url: partUrl });
            }
        }

        currentRoute = currentRoute.parent;
    }

    parts.reverse();

    return (
        <MixinButton
            options={{
                size: "mixin-button-sm",
                theme: "theme-button-generic-white",
            }}
            className="shrink-0"
            isStatic
            hasShadow
            type="button"
        >
            {parts.map(({ url, label }, i) => {
                const isLink = url != null;

                return (
                    <React.Fragment key={i}>
                        {isLink ? (
                            <Link className="hover:underline" to={url}>
                                {label}
                            </Link>
                        ) : (
                            <div>{label}</div>
                        )}
                        {i < parts.length - 1 && <div key={`divider-${i}`}>›</div>}
                    </React.Fragment>
                );
            })}
        </MixinButton>
    );
}
