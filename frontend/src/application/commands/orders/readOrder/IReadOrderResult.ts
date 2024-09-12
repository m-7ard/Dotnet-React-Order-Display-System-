import { Result } from "neverthrow";
import IApplicationErrors from "../../../interfaces/IApplicationErrors";
import IOrder from "../../../../domain/models/IOrder";

type IReadOrderResult = Result<{
    order: IOrder;
}, IApplicationErrors>;

export default IReadOrderResult;
