import IProduct from "../../../domain/models/IProduct";

export default interface IProductStateManager {
    setProduct(data: IProduct): void;
    getProduct(productId: IProduct["id"]): IProduct | null;
}