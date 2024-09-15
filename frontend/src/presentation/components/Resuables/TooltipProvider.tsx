import { useState } from "react";
import { TooltipContext } from "../../contexts/TooltipContext";

export default function TooltipProvider(
    props: React.PropsWithChildren<{
        open: boolean;
        positioning: {
            top?: string;
            right?: string;
            bottom?: string;
            left?: string;
        };
    }>,
) {
    const { open, positioning, children } = props;
    const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
    const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

    return (
        <TooltipContext.Provider
            value={{
                open: open,
                positioning: positioning,
                elements: {
                    referenceElement: referenceElement,
                    setReferenceElement: setReferenceElement,
                    targetElement: targetElement,
                    setTargetElement: setTargetElement,
                },
            }}
        >
            {children}
        </TooltipContext.Provider>
    );
}
