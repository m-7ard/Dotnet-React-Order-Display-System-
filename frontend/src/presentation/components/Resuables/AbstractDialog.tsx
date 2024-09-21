import { FunctionComponent, useState } from "react";
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
                <Dialog open={open} onClose={() => setOpen(false)}>
                    {Panel}
                </Dialog>
            ) : null}
        </AbstractDialogContext.Provider>
    );
}

function Dialog(props: {
    open: boolean;
    onClose: () => void;
    children: ReactNode | ((props: { open: boolean; onClose: () => void }) => ReactNode);
}) {
    const { children, onClose, open } = props;

    return createPortal(
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            {typeof children === "function" ? children({ open, onClose }) : children}
        </div>,
        document.body,
    );
}
