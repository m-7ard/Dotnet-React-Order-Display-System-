import { Result } from "neverthrow";
import IApplicationErrors from "../../../interfaces/IApplicationErrors";
import Order from "../../../../domain/models/Order";

type MarkOrderItemFinishedResult = Result<{
    order: Order;
}, IApplicationErrors>;

export default MarkOrderItemFinishedResult;
