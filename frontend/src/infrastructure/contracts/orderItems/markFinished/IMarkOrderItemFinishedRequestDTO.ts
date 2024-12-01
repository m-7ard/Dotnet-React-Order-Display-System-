import Order from "../../../../domain/models/Order";
import OrderItem from "../../../../domain/models/OrderItem";

export default interface IMarkOrderItemFinishedRequestDTO {
    orderId: Order["id"];
    orderItemId: OrderItem["id"];
}
