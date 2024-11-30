import IDraftImageDataAccess from "../../application/interfaces/dataAccess/IDraftImageDataAccess";
import IOrderDataAccess from "../../application/interfaces/dataAccess/IOrderDataAccess";
import IProductDataAccess from "../../application/interfaces/dataAccess/IProductDataAccess";
import IProductHistoryDataAccess from "../../application/interfaces/dataAccess/IProductHistoryDataAccess";
import createSafeContext from "../utils/createSafeContext";

export const [DataAccessContext, useDataAccessContext] = createSafeContext<{
    productDataAccess: IProductDataAccess;
    productHistoryDataAccess: IProductHistoryDataAccess;
    orderDataAccess: IOrderDataAccess;
    draftImageDataAccess: IDraftImageDataAccess;
}>("useDataAccessContext must be used within DataAccessContext.Provider");