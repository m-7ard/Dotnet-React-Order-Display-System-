import React, { ComponentType, useEffect, useId, useRef } from "react";
import { useGlobalDialogContext } from "./GlobalDialogContext";
import deepEqual from "../../utils/deepEqual";

export default function GlobalDialog<T>(props: {
    Trigger: React.FunctionComponent<{ onToggle: () => void; }>;
    Panel: ComponentType<T>;
    panelProps: T;
    zIndex: number;
}) {
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
                dispatchDialog(
                    ID,
                    {
                        Panel: (props) => <Panel {...props} />,
                        props: panelProps,
                        zIndex: zIndex
                    },
                );
            }}
        />
    );
}
