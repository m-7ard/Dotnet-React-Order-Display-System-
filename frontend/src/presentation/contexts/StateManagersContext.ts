import IOrderStateManager from "../../application/interfaces/stateManagers/IOrderStateManager";
import IProductStateManager from "../../application/interfaces/stateManagers/IProductStateManager";
import createSafeContext from "../utils/createSafeContext";

export const [StateManagersContext, useStateManagersContext] = createSafeContext<{
    orderStateManager: IOrderStateManager;
    productStateManager: IProductStateManager;
}>("useStateManagersContext must be used within StateManagersContext.Provider.");