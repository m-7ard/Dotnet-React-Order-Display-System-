import React, { ComponentProps, ComponentType, useState } from "react";
import TooltipProvider from "./TooltipProvider";
import { createPortal } from "react-dom";
import { AbstractPopoverContext } from "../../contexts/AbstractPopoverContext";

export type AbstractPopoverProps = {
    Trigger: ComponentType<{ open: boolean; onToggle: () => void }>;
    Panel: React.ReactNode;
    positioning: ComponentProps<typeof TooltipProvider>["positioning"];
};

export default function AbstractPopover({ Trigger, Panel }: AbstractPopoverProps) {
    const [open, setOpen] = useState(false);

    return (
        <AbstractPopoverContext.Provider
            value={{
                onClose: () => setOpen(false),
            }}
        >
            {<Trigger open={open} onToggle={() => setOpen(!open)} />}
            {open && createPortal(Panel, document.body)}
        </AbstractPopoverContext.Provider>
    );
}
