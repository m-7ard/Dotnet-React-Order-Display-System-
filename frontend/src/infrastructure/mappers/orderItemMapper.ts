import OrderItem from "../../domain/models/OrderItem";
import OrderItemStatus from "../../domain/valueObjects/OrderItem/OrderItemStatus";
import IOrderItemApiModel from "../apiModels/IOrderItemApiModel";
import productHistoryMapper from "./productHistoryMapper";

const orderItemMapper = {
    apiToDomain: (source: IOrderItemApiModel): OrderItem => {
        return new OrderItem({
            id: source.id,
            quantity: source.quantity,
            status: OrderItemStatus.create(source.status),
            dateCreated: new Date(source.dateCreated),
            dateFinished: new Date(source.dateFinished),
            orderId: source.orderId,
            productHistory: productHistoryMapper.apiToDomain(source.productHistory),
        });
    },
};

export default orderItemMapper;
