import { PropsWithChildren } from "react";
import generateLabel from "../../utils/generateLabel";

export default function FormField({
    errors,
    name,
    label,
    row = false,
    children,
}: PropsWithChildren<{
    errors?: string[];
    name: string;
    label?: string;
    row?: boolean;
}>) {
    return (
        <div className="flex flex-col gap-y-0.5">
            {row ?? false ? (
                <div className="flex flex-row gap-2 items-center">
                    {children}
                    <div className="text-sm font-medium">{label ?? generateLabel(name)}</div>
                </div>
            ) : (
                <>
                    <div className="text-sm font-medium leading-none">{label ?? generateLabel(name)}</div>
                    {children}
                </>
            )}
            {errors == null ? null : (
                <div className="flex flex-col gap-0.5">
                    {errors.map((message) => (
                        <div className="text-xs text-red-700" key={message}>
                            {message}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
