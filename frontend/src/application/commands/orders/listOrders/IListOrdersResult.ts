import { Result } from "neverthrow";
import IApplicationErrors from "../../../interfaces/IApplicationErrors";
import Order from "../../../../domain/models/Order";

type IListOrdersResult = Result<{
    orders: Order[] 
}, IApplicationErrors>;

export default IListOrdersResult;
