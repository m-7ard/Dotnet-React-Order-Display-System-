import React from "react";

export default function Divider(props: Omit<React.HtmlHTMLAttributes<HTMLHRElement>, "className">) {
    return <hr className="h-0 w-full border-bottom border-gray-300 rounded-lg overflow-hidden shadow-lg" {...props}></hr>;
}
