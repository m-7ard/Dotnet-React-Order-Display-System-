import IOrderDataAccess from "../application/interfaces/dataAccess/IOrderDataAccess";
import IProductDataAccess from "../application/interfaces/dataAccess/IProductDataAccess";
import IProductHistoryDataAccess from "../application/interfaces/dataAccess/IProductHistoryDataAccess";

export const mockProductDataAccess: jest.Mocked<IProductDataAccess> = {
    createProduct: jest.fn(),
    listProducts: jest.fn(),
    readProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
};

export const mockOrderDataAccess: jest.Mocked<IOrderDataAccess> = {
    listOrders: jest.fn(),
    createOrder: jest.fn(),
    markOrderItemFinished: jest.fn(),
    markOrderFinished: jest.fn(),
    readOrder: jest.fn(),
};

export const mockProductHistoryDataAccess: jest.Mocked<IProductHistoryDataAccess> = {
    listProductHistories: jest.fn(),
};