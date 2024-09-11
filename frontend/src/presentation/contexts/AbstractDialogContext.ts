import createSafeContext from "../utils/createSafeContext";

export const [AbstractDialogContext, useAbstractDialogContext] = createSafeContext<{
    onClose: () => void;
}>("useAbstractDialogContext must be used within AbstractDialogContext.Provider.");
