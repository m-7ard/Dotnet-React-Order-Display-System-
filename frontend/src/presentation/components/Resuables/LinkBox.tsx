import { Link } from "@tanstack/react-router";
import React from "react";
import ROUTE_DATA from "../../routes/ROUTE_DATA";
import MixinButton from "./MixinButton";

export default function LinkBox(props: {
    parts: Array<
        | {
              label: React.ReactNode;
              isLink: true;
              to: string;
          }
        | {
              label: React.ReactNode;
              isLink: false;
          }
    >;
}) {
    const parts = [{ isLink: true, to: ROUTE_DATA.frontpage.build({}), label: "All" }, ...props.parts];

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
            {parts.map((part, i) => (
                <React.Fragment key={i}>
                    {part.isLink ? (
                        <Link className="hover:underline" to={part.to}>
                            {part.label}
                        </Link>
                    ) : (
                        <div>{part.label}</div>
                    )}
                    {i < parts.length - 1 && <div key={`divider-${i}`}>›</div>}
                </React.Fragment>
            ))}
        </MixinButton>
    );
}
