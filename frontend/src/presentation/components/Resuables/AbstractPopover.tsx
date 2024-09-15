import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import React, { ComponentProps, ComponentType } from "react";
import TooltipProvider from "./TooltipProvider";
import { useTooltipContext } from "../../contexts/TooltipContext";

export type AbstractPopoverTriggerProps = { open: boolean };
export type AbstractPopoverPanelProps = Record<string, never>;
export type AbstractPopoverProps = {
    Trigger: ComponentType<AbstractPopoverTriggerProps>;
    Panel: ComponentType<AbstractPopoverPanelProps>;
    positioning: ComponentProps<typeof TooltipProvider>["positioning"];
};

export default function AbstractPopover({ Trigger, Panel, positioning }: AbstractPopoverProps) {
    return (
        <Popover className={"flex flex-col"}>
            {({ open }) => {
                return (
                    <TooltipProvider open={open} positioning={positioning}>
                        {<Trigger open={open} />}
                        {open && <Panel />}
                    </TooltipProvider>
                );
            }}
        </Popover>
    );
}

export function AbstractPopoverTrigger(attrs: React.ComponentProps<typeof PopoverButton>) {
    const {
        elements: { setReferenceElement },
    } = useTooltipContext();
    return <PopoverButton {...attrs} ref={setReferenceElement} />;
}

export function AbstractPopoverPanel(attrs: React.ComponentProps<typeof PopoverPanel>) {
    const {
        elements: { setTargetElement },
    } = useTooltipContext();
    return <PopoverPanel {...attrs} ref={setTargetElement} />;
}
