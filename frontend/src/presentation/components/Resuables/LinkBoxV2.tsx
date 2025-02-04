import React from "react";
import MixinButton from "./MixinButton";
import { TAnyGenericRoute, IGenericRoutes, TExtractGenericRouteParams, genericRoutes, isLayoutRoute } from "../../routes/Route";
import RouterLink from "./RouterLink";

export default function LinkBoxV2<T extends TAnyGenericRoute>({ exp, params }: { exp: (keys: IGenericRoutes) => T; params: TExtractGenericRouteParams<T> }) {
    const linkParts: Array<{
        label: string;
        route: TAnyGenericRoute;
    }> = [];

    let currentRoute: TAnyGenericRoute | null = exp(genericRoutes);

    while (currentRoute != null) {
        const { label } = currentRoute;

        if (label != null) {
            let partLabel: string;

            if (label[0] === ":") {
                // Replace the :... label with the url parameter value
                const urlParameterKey = label.slice(1);
                const urlParameterValue = params[urlParameterKey];

                if (urlParameterKey == null) {
                    throw new Error(
                        `No matching url parameter was found for the url parameter "${urlParameterKey}" for the route label of route "${currentRoute.pattern}". To fix this make sure that the label matches the url parameter at the time of RouteData creation.`,
                    );
                }

                partLabel = urlParameterValue;
            } else {
                partLabel = label;
            }

            linkParts.push({ route: currentRoute, label: partLabel });
        }

        currentRoute = currentRoute.parent;
    }

    linkParts.reverse();

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
            {linkParts.map(({ route, label }, i) => {
                const isLayout = isLayoutRoute(route);

                return (
                    <React.Fragment key={i}>
                        {!isLayout ? (
                            <RouterLink className="hover:underline" exp={() => route} params={params}>
                                {label}
                            </RouterLink>
                        ) : (
                            <div>{label}</div>
                        )}
                        {i < linkParts.length - 1 && <div key={`divider-${i}`}>›</div>}
                    </React.Fragment>
                );
            })}
        </MixinButton>
    );
}
