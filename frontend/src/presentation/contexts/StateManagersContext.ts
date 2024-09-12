import IOrderStateManager from "../../application/interfaces/IOrderStateManager";
import createSafeContext from "../utils/createSafeContext";

export const [StateManagersContext, useStateManagersContext] = createSafeContext<{
    orderStateManager: IOrderStateManager;
}>("useStateManagersContext must be used within StateManagersContext.Provider.");