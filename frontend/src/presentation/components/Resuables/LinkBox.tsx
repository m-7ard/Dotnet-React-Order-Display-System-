import { Link } from "@tanstack/react-router";
import React from "react";

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
    const parts = [{ isLink: true, to: "/", label: "All" }, ...props.parts];

    return (
        <div className="flex flex-row gap-1 text-sm text-gray-900 px-2 py-px bg-gray-50 border border-gray-900">
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
