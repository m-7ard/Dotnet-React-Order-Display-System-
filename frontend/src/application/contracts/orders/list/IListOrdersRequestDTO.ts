import IProduct from "../../../../domain/models/IProduct";
import IProductHistory from "../../../../domain/models/IProductHistory";
import Order from "../../../../domain/models/Order";

export default interface IListOrdersRequestDTO {
    minTotal: number | null;
    maxTotal: number | null;
    status: string | null;
    createdBefore: Date | null;
    createdAfter: Date | null;
    id: Order["id"] | null;
    productId: IProduct["id"] | null;
    productHistoryId: IProductHistory["id"] | null;
    orderBy: string | null;
}