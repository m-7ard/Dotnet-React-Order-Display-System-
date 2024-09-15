import OrderStateManager from "../../infrastructure/stateManagement/OrderStateManager";
import ProductStateManager from "../../infrastructure/stateManagement/ProductStateManager";
import queryClient from "./queryClient";

export const orderStateManager = new OrderStateManager({ queryClient: queryClient });
export const productStateManager = new ProductStateManager({ queryClient: queryClient });