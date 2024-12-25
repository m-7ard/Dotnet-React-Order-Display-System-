/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ComponentProps, useEffect, useId, useRef } from "react";
import { useGlobalDialogContext } from "./GlobalDialog.Context";
import deepEqual from "../../utils/deepEqual";

type GlobalDialogProps<T extends React.ComponentType<P>, P = ComponentProps<T>> = {
    Trigger: React.ComponentType<{ onToggle: () => void }>;
    Panel: T;
    panelProps: P;
    zIndex: number;
};

export default function GlobalDialog<T extends React.ComponentType<P>, P = ComponentProps<T>>(props: GlobalDialogProps<T, P>) {
    const ID = useId();
    const { Trigger, Panel, panelProps, zIndex } = props;
    const { dispatchDialog, dialogExists, updateDialog } = useGlobalDialogContext();
    const prevPanelPropsRef = useRef(panelProps);

    useEffect(() => {
        if (dialogExists(ID) === false) return;
        if (!deepEqual(panelProps, prevPanelPropsRef.current)) {
            updateDialog(ID, panelProps);
            prevPanelPropsRef.current = panelProps;
        }
    }, [panelProps, dialogExists, updateDialog, ID]);

    return (
        <Trigger
            onToggle={() => {
                dispatchDialog(ID, {
                    Panel: (props) => <Panel {...props} />,
                    props: panelProps,
                    zIndex: zIndex,
                });
            }}
        />
    );
}
