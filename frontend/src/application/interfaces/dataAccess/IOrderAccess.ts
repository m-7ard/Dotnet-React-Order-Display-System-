import { Result } from "neverthrow";
import IOrder from "../../../domain/models/IOrder";
import ICreateOrderRequestDTO from "../../contracts/orders/create/ICreateOrderRequestDTO";
import IListOrdersRequestDTO from "../../contracts/orders/list/IListOrdersRequestDTO";
import IPlainApiError from "../IPlainApiError";

export default interface IOrderDataAccess {
    listOrders(request: IListOrdersRequestDTO): Promise<Result<IOrder[], IPlainApiError>>;
    createOrder(request: ICreateOrderRequestDTO): Promise<Result<IOrder, IPlainApiError>>;
}