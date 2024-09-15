import { Result } from "neverthrow";
import IApplicationErrors from "../../../interfaces/IApplicationErrors";
import Order from "../../../../domain/models/Order";

type MarkOrderFinishedResult = Result<{
    order: Order;
}, IApplicationErrors>;

export default MarkOrderFinishedResult;
