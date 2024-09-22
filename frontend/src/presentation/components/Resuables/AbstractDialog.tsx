import { FunctionComponent, PropsWithChildren, useState } from "react";
import { AbstractDialogContext } from "../../contexts/AbstractDialogContext";
import { ReactNode } from "@tanstack/react-router";
import { createPortal } from "react-dom";

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
        <AbstractDialogContext.Provider
            value={{
                onClose: () => setOpen(false),
            }}
        >
            {Trigger == null ? null : <Trigger onToggle={() => onToggle()} open={open} />}
            {open ? (
                <Dialog onClose={() => setOpen(false)}>
                    {Panel}
                </Dialog>
            ) : null}
        </AbstractDialogContext.Provider>
    );
}

function Dialog(props: PropsWithChildren<{
    onClose: () => void;
}>) {
    const { children, onClose } = props;

    return createPortal(
        <div
            className="fixed z-20 inset-0 bg-black/30 flex items-center justify-center"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            {children}
        </div>,
        document.body,
    );
}
