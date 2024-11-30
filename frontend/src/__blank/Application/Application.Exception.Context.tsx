import createSafeContext from "../../presentation/utils/createSafeContext";
import IExceptionService from "../Interfaces/IExceptionService";

export const [ApplicationExceptionContext, useApplicationExceptionContext] = createSafeContext<IExceptionService>(
    "useApplicationExceptionContext must be used within ApplicationExceptionContext.Provider.",
);
