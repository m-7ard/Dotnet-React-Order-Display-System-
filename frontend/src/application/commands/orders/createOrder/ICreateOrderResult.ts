import { Result } from "neverthrow";
import IApplicationErrors from "../../../interfaces/IApplicationErrors";
import Order from "../../../../domain/models/Order";

type ICreateOrderResult = Result<{
    order: Order;
}, IApplicationErrors>;

export default ICreateOrderResult;
