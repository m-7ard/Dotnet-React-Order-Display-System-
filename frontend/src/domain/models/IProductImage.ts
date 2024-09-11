import IProduct from "./IProduct";

export default interface IProductImage {
    id: number;
    fileName: string;
    dateCreated: Date;
    productId: IProduct["id"] | null;
}
