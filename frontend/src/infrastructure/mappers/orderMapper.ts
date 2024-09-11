import IOrder from "../../domain/models/IOrder";
import OrderStatus from "../../domain/valueObjects/Order/OrderStatus";
import IOrderApiModel from "../apiModels/IOrderApiModel";
import orderItemMapper from "./orderItemMapper";

const orderMapper = {
    apiToDomain: (source: IOrderApiModel): IOrder => {
        return {
            id: source.id,
            total: source.total,
            status: OrderStatus.create(source.status.name),
            dateCreated: source.dateCreated,
            dateFinished: source.dateFinished,
            orderItems: source.orderItems.map(orderItemMapper.apiToDomain),
        };
    },
};

export default orderMapper;
