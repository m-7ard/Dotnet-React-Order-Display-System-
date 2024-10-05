import IOrderStateManager from "../application/interfaces/stateManagers/IOrderStateManager";
import IProductStateManager from "../application/interfaces/stateManagers/IProductStateManager";
import IProduct from "../domain/models/IProduct";
import Order from "../domain/models/Order";

export class MockProductStateManager implements jest.Mocked<IProductStateManager> {
    public products: IProduct[];

    constructor() {
        this.products = [];
        this.getProduct = jest.fn(this._getProduct);
        this.setProduct = jest.fn(this._setProduct);
    }

    private _getProduct(productId: IProduct["id"]): IProduct | null {
        return this.products.find((product) => product.id === productId) ?? null;
    }

    private _setProduct(data: IProduct): void {
        this.products.push(data);
    }

    public getProduct: jest.Mock<IProduct | null, [productId: IProduct["id"]]>;
    public setProduct: jest.Mock<void, [data: IProduct]>;
}

export class MockOrderStateManager implements jest.Mocked<IOrderStateManager> {
    public orders: Order[];

    constructor() {
        this.orders = [];
        this.getOrder = jest.fn(this._getOrder);
        this.setOrder = jest.fn(this._setOrder);
    }

    private _getOrder(orderId: Order["id"]): Order | null {
        return this.orders.find((order) => order.id === orderId) ?? null;
    }

    private _setOrder(data: Order): void {
        this.orders.push(data);
    }

    public getOrder: jest.Mock<Order | null, [orderId: Order["id"]]>;
    public setOrder: jest.Mock<void, [data: Order]>;
}