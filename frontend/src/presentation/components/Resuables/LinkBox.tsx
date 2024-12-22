import { Link } from "@tanstack/react-router";
import React from "react";
import routeData from "../../routes/_routeData";

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
    const parts = [{ isLink: true, to: routeData.frontpage.build({}), label: "All" }, ...props.parts];

    return (
        <div className="mixin-button-like mixin-button-sm cursor-auto bg-white rounded-lg border border-gray-300 text-gray-900">
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
        </div>
    );
}
