import IOrderItem from "../../domain/models/IOrderItem";
import IOrderItemApiModel from "../apiModels/IOrderItemApiModel";
import productHistoryMapper from "./productHistoryMapper";

const orderItemMapper = {
    apiToDomain: (source: IOrderItemApiModel): IOrderItem => {
        return {
            id: source.id,
            quantity: source.quantity,
            status: source.status.name,
            dateCreated: source.dateCreated,
            dateFinished: source.dateFinished,
            orderId: source.orderId,
            productHistory: productHistoryMapper.apiToDomain(source.productHistory),
        };
    },
};

export default orderItemMapper;
