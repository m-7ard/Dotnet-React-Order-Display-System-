import { Dialog, DialogPanel, DialogPanelProps } from "@headlessui/react";
import { FunctionComponent, useState } from "react";
import { AbstractDialogContext } from "../../contexts/AbstractDialogContext";
import { ReactNode } from "@tanstack/react-router";

export type AbstractDialogTriggerProps = {
    open: boolean;
    onToggle: () => void;
};

export default function AbstractDialog({
    Trigger,
    Panel,
    startOpen = false,
}: {
    Trigger?: FunctionComponent<AbstractDialogTriggerProps>;
    Panel: ReactNode;
    startOpen?: boolean;
}) {
    const [open, setOpen] = useState(startOpen);
    const onToggle = () => setOpen(!open);

    return (
        <AbstractDialogContext.Provider value={{
            onClose: () => setOpen(false)
        }}>
            {Trigger == null ? null : <Trigger onToggle={() => onToggle()} open={open} />}
            <Dialog open={open} onClose={() => setOpen(false)} className="relative flex" style={{ zIndex: 5000 }}>
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex justify-center">{open ? Panel : null}</div>
            </Dialog>
        </AbstractDialogContext.Provider>
    );
}

export function AbstractDialogPanel(props: DialogPanelProps) {
    return <DialogPanel {...props} />;
}
