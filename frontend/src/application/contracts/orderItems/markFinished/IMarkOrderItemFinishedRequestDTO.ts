import Order from "../../../../domain/models/Order";
import IOrderItem from "../../../../domain/models/IOrderItem";

export default interface IMarkOrderItemFinishedRequestDTO {
    orderId: Order["id"];
    orderItemId: IOrderItem["id"];
}
