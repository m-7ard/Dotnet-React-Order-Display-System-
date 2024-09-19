import IImageData from "./IImageData";

export default interface IProduct {
    id: number,
    name: string,
    price: number,
    description: string,
    dateCreated: Date,
    images: IImageData[]
}