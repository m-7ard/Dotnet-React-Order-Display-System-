import IProduct from "../../../../domain/models/IProduct";

export default interface ICreateOrderRequestDTO {
    orderItemData: {
        [UID: string]: {
            productId: IProduct["id"];
            quantity: number;
        };
    };
}
