/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { GlobalDialogContext } from "./GlobalDialogContext";
import { GlobalDialogPanelContext, useGlobalDialogPanelContext } from "./GlobalDialogPanelContext";

export type DialogData = {
    Panel: React.FunctionComponent<any>;
    props: any;
    zIndex: number;
};

type DialogStore = {
    [ID: string]: DialogData;
};

export default function GlobalDialogManager(props: React.PropsWithChildren) {
    const { children } = props;
    const [dialogs, setDialogs] = useState<DialogStore>({});

    const closeAllDialogs = useCallback(() => {
        setDialogs({});
    }, []);

    useEffect(() => {
        window.addEventListener("popstate", closeAllDialogs);
        return () => {
            window.removeEventListener("popstate", closeAllDialogs);
        };
    }, [closeAllDialogs]);

    const dispatchDialog = useCallback(
        (ID: string, data: DialogData) =>
            setDialogs((prev) => {
                const newState = { ...prev };
                newState[ID] = data;
                return newState;
            }),
        [],
    );

    const closeDialog = useCallback(
        (ID: string) =>
            setDialogs((prev) => {
                const newState = { ...prev };
                delete newState[ID];
                return newState;
            }),
        [],
    );

    const dialogExists = useCallback((ID: string) => dialogs[ID] != null, [dialogs]);

    const updateDialog = useCallback((ID: string, data: any) => {
        setDialogs((prev) => {
            const newState = { ...prev };
            newState[ID].props = data;
            return newState;
        });
    }, []);

    return (
        <GlobalDialogContext.Provider value={{ dispatchDialog, closeDialog, dialogExists, updateDialog }}>
            {children}
            {Object.entries(dialogs).map(([ID, { Panel, props, zIndex }]) => {
                return createPortal(
                    <GlobalDialogPanelContext.Provider value={{ onClose: () => closeDialog(ID) }}>
                        <DialogBackdrop zIndex={zIndex}>
                            <Panel {...props} />
                        </DialogBackdrop>
                    </GlobalDialogPanelContext.Provider>,
                    document.body,
                );
            })}
        </GlobalDialogContext.Provider>
    );
}

function DialogBackdrop(props: PropsWithChildren<{ zIndex: number }>) {
    const { children, zIndex } = props;
    const { onClose } = useGlobalDialogPanelContext();

    return (
        <div
            className={`fixed inset-0 flex flex-row justify-center items-center bg-black/30 p-4`}
            style={{ zIndex: zIndex }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            {children}
        </div>
    );
}
