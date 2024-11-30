import ICreateOrderRequestDTO from "../../contracts/orders/create/ICreateOrderRequestDTO";
import IListOrdersRequestDTO from "../../contracts/orders/list/IListOrdersRequestDTO";
import IReadOrderRequestDTO from "../../contracts/orders/read/IReadOrderRequestDTO";
import IMarkOrderItemFinishedRequestDTO from "../../contracts/orderItems/markFinished/IMarkOrderItemFinishedRequestDTO";
import IMarkOrderFinishedRequestDTO from "../../contracts/orders/markFinished/IMarkOrderFinishedRequestDTO";

export default interface IOrderDataAccess {
    listOrders(request: IListOrdersRequestDTO): Promise<Response>;
    createOrder(request: ICreateOrderRequestDTO): Promise<Response>;
    markOrderItemFinished(request: IMarkOrderItemFinishedRequestDTO): Promise<Response>;
    markOrderFinished(request: IMarkOrderFinishedRequestDTO): Promise<Response>;
    readOrder(request: IReadOrderRequestDTO): Promise<Response>;
}