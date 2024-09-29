import { Result } from "neverthrow";
import IApplicationErrors from "../../../interfaces/IApplicationErrors";
import IProductHistory from "../../../../domain/models/IProductHistory";

type IListProductHistoriesResult = Result<{
    productHistories: IProductHistory[] 
}, IApplicationErrors>;

export default IListProductHistoriesResult;
