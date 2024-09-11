import { Result } from "neverthrow";
import IApplicationErrors from "../../../interfaces/IApplicationErrors";
import IOrder from "../../../../domain/models/IOrder";

type ICreateOrderResult = Result<{
    order: IOrder;
}, IApplicationErrors>;

export default ICreateOrderResult;
