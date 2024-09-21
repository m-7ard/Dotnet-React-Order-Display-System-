import createSafeContext from "../utils/createSafeContext";

export const [AbstractPopoverContext, useAbstractPopoverContext] = createSafeContext<{
    onClose: () => void;
}>("useAbstractPopoverContext must be used within AbstractPopoverContext.Provider.");
