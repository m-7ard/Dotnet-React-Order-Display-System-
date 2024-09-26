import { Link } from "@tanstack/react-router";
import React from "react";

export default function Linkbox(props: {
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
        <div className="flex flex-row gap-1 text-sm text-gray-900 px-2 py-px bg-gray-200/50  border border-gray-900">
            {parts.map((part, i) => (
                <>
                    {part.isLink ? (
                        <Link className="hover:underline" to={part.to} key={i}>
                            {part.label}
                        </Link>
                    ) : (
                        <div key={i}>{part.label}</div>
                    )}
                    {i < parts.length - 1 && <div key={`d-${i}`}>›</div>}
                </>
            ))}
        </div>
    );
}
