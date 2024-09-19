import DraftImageDataAccess from "../../infrastructure/dataAccess/DraftImageDataAccess";
import OrderDataAccess from "../../infrastructure/dataAccess/OrderDataAccess";
import ProductDataAccess from "../../infrastructure/dataAccess/ProductDataAccess";

export const productDataAccess = new ProductDataAccess();
export const orderDataAccess = new OrderDataAccess();
export const draftImageDataAccess = new DraftImageDataAccess();