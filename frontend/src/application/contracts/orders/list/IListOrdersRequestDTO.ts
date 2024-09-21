import IProduct from "../../../../domain/models/IProduct";
import Order from "../../../../domain/models/Order";

export default interface IListOrdersRequestDTO {
    id: Order["id"] | null;
    minTotal: number | null;
    maxTotal: number | null;
    status: string | null;
    createdBefore: Date | null;
    createdAfter: Date | null;
    productId: IProduct["id"] | null;
}