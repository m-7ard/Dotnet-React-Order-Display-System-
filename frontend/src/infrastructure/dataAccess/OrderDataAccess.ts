import IOrderDataAccess from "../../application/interfaces/dataAccess/IOrderAccess";
import ICreateOrderRequestDTO from "../../application/contracts/orders/create/ICreateOrderRequestDTO";
import ICreateOrderResponseDTO from "../../application/contracts/orders/create/ICreateOrderResponseDTO";
import IListOrdersRequestDTO from "../../application/contracts/orders/list/IListOrdersRequestDTO";
import { err, ok, Result } from "neverthrow";
import IOrder from "../../domain/models/IOrder";
import IPlainApiError from "../../application/interfaces/IPlainApiError";
import handleResponse from "../utils/handleResponse";
import orderMapper from "../mappers/orderMapper";
import IListOrdersResponseDTO from "../../application/contracts/orders/list/IListOrdersResponseDTO";

export default class OrderDataAccess implements IOrderDataAccess {
    private readonly _apiRoute = "http://localhost:5102/api/orders";

    async listOrders(request: IListOrdersRequestDTO): Promise<Result<IOrder[], IPlainApiError>> {
        const urlParams = new URLSearchParams();
        Object.entries(request).forEach(([name, value]) => value != null && urlParams.append(name, value));
        const response = await fetch(`${this._apiRoute}/list?${urlParams}`, {
            method: "GET",
        });

        const { isOk, data } = await handleResponse<IListOrdersResponseDTO, IPlainApiError>({
            response,
            onOk: async (res) => await res.json(),
            onError: async (res) => await res.json(),
        });

        if (isOk) {
            console.log("data: ", data.orders)
            return ok(data.orders.map(orderMapper.apiToDomain));
        }

        return err(data);
    }

    async createOrder(request: ICreateOrderRequestDTO): Promise<Result<IOrder, IPlainApiError>> {
        const response = await fetch(`${this._apiRoute}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

        const { isOk, data } = await handleResponse<ICreateOrderResponseDTO, IPlainApiError>({
            response,
            onOk: async (res) => await res.json(),
            onError: async (res) => await res.json(),
        });

        if (isOk) {
            return ok(orderMapper.apiToDomain(data.order));
        }

        return err(data);
    }
}
