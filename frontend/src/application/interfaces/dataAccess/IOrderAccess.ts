import { Result } from "neverthrow";
import Order from "../../../domain/models/Order";
import ICreateOrderRequestDTO from "../../contracts/orders/create/ICreateOrderRequestDTO";
import IListOrdersRequestDTO from "../../contracts/orders/list/IListOrdersRequestDTO";
import IPlainApiError from "../IPlainApiError";
import IReadOrderRequestDTO from "../../contracts/orders/read/IReadOrderRequestDTO";
import IMarkOrderItemFinishedRequestDTO from "../../contracts/orderItems/markFinished/IMarkOrderItemFinishedRequestDTO";
import IMarkOrderFinishedRequestDTO from "../../contracts/orders/markFinished/IMarkOrderFinishedRequestDTO";

export default interface IOrderDataAccess {
    listOrders(request: IListOrdersRequestDTO): Promise<Result<Order[], IPlainApiError>>;
    createOrder(request: ICreateOrderRequestDTO): Promise<Result<Order, IPlainApiError>>;
    markOrderItemFinished(request: IMarkOrderItemFinishedRequestDTO): Promise<Result<Order, IPlainApiError>>;
    markOrderFinished(request: IMarkOrderFinishedRequestDTO): Promise<Result<Order, IPlainApiError>>;
    readOrder(request: IReadOrderRequestDTO): Promise<Result<Order, IPlainApiError>>;
}