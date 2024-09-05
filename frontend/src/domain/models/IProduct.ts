import IProductImage from "./IProductImage";

export default interface IProduct {
    id: number,
    name: string,
    price: number,
    description: string,
    dateCreated: Date,
    images: IProductImage[]
}