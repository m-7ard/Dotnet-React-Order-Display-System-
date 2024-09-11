import IProduct from "./IProduct";

export default interface IProductHistory {
    id: number;
    name: string;
    images: string[];
    description: string;
    price: number;
    productId: IProduct["id"];
    validFrom: Date;
    validTo: Date;
}