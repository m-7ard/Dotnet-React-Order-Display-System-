import IOrderDataAccess from "../../application/interfaces/dataAccess/IOrderAccess";
import ICreateOrderRequestDTO from "../../application/contracts/orders/create/ICreateOrderRequestDTO";
import ICreateOrderResponseDTO from "../../application/contracts/orders/create/ICreateOrderResponseDTO";
import IListOrdersRequestDTO from "../../application/contracts/orders/list/IListOrdersRequestDTO";
import { err, ok, Result } from "neverthrow";
import Order from "../../domain/models/Order";
import IPlainApiError from "../../application/interfaces/IPlainApiError";
import handleResponse from "../utils/handleResponse";
import orderMapper from "../mappers/orderMapper";
import IListOrdersResponseDTO from "../../application/contracts/orders/list/IListOrdersResponseDTO";
import IReadOrderRequestDTO from "../../application/contracts/orders/read/IReadOrderRequestDTO";
import IReadOrderResponseDTO from "../../application/contracts/orders/read/IReadOrderResponseDTO";
import IMarkOrderItemFinishedRequestDTO from "../../application/contracts/orderItems/markFinished/IMarkOrderItemFinishedRequestDTO";
import IMarkOrderItemFinishedResponseDTO from "../../application/contracts/orderItems/markFinished/IMarkOrderItemFinishedResponseDTO";
import IMarkOrderFinishedRequestDTO from "../../application/contracts/orders/markFinished/IMarkOrderFinishedRequestDTO";
import IMarkOrderFinishedResponseDTO from "../../application/contracts/orders/markFinished/IMarkOrderFinishedResponseDTO";

export default class OrderDataAccess implements IOrderDataAccess {
    private readonly _apiRoute = "http://localhost:5102/api/orders";

    async listOrders(request: IListOrdersRequestDTO): Promise<Result<Order[], IPlainApiError>> {
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
            console.log("data: ", data.orders);
            return ok(data.orders.map(orderMapper.apiToDomain));
        }

        return err(data);
    }

    async createOrder(request: ICreateOrderRequestDTO): Promise<Result<Order, IPlainApiError>> {
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

    async readOrder(request: IReadOrderRequestDTO): Promise<Result<Order, IPlainApiError>> {
        const response = await fetch(`${this._apiRoute}/${request.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const { isOk, data } = await handleResponse<IReadOrderResponseDTO, IPlainApiError>({
            response,
            onOk: async (res) => await res.json(),
            onError: async (res) => await res.json(),
        });

        if (isOk) {
            return ok(orderMapper.apiToDomain(data.order));
        }

        return err(data);
    }

    async markOrderItemFinished(request: IMarkOrderItemFinishedRequestDTO): Promise<Result<Order, IPlainApiError>> {
        const response = await fetch(`${this._apiRoute}/${request.orderId}/item/${request.orderItemId}/mark_finished`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const { isOk, data } = await handleResponse<IMarkOrderItemFinishedResponseDTO, IPlainApiError>({
            response,
            onOk: async (res) => await res.json(),
            onError: async (res) => await res.json(),
        });

        if (isOk) {
            return ok(orderMapper.apiToDomain(data.order));
        }

        return err(data);
    }

    async markOrderFinished(request: IMarkOrderFinishedRequestDTO): Promise<Result<Order, IPlainApiError>> {
        const response = await fetch(`${this._apiRoute}/${request.orderId}/mark_finished`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const { isOk, data } = await handleResponse<IMarkOrderFinishedResponseDTO, IPlainApiError>({
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
