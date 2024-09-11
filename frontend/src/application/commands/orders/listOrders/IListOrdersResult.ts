import { Result } from "neverthrow";
import IApplicationErrors from "../../../interfaces/IApplicationErrors";
import IOrder from "../../../../domain/models/IOrder";

type IListOrdersResult = Result<{
    orders: IOrder[] 
}, IApplicationErrors>;

export default IListOrdersResult;
