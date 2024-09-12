import OrderStateManager from "../../infrastructure/stateManagement/OrderStateManager";
import queryClient from "./queryClient";

export const orderStateManager = new OrderStateManager({ queryClient: queryClient });