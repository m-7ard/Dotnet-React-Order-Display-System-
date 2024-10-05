import { ok } from "neverthrow";
import IProduct from "../../../../domain/models/IProduct";
import { mockOrderDataAccess } from "../../../../__mocks__/dataAccess";
import Order from "../../../../domain/models/Order";
import ListOrdersCommand from "../../../../application/commands/orders/listOrders/ListOrdersCommand";
import ListOrdersHandler from "../../../../application/commands/orders/listOrders/ListOrdersHandler";
import { createOrder, createProduct } from "../../../../__utils__/mixins";

describe("ListOrdersHandler", () => {
    let handler: ListOrdersHandler;
    let mockProduct001: IProduct;
    let mockProduct002: IProduct;
    let mockProduct003: IProduct;
    let mockOrder001: Order;
    let mockOrder002: Order;
    let mockOrders: Order[];

    beforeEach(() => {
        handler = new ListOrdersHandler({ orderDataAccess: mockOrderDataAccess });

        mockProduct001 = createProduct({ seed: 1, images: [] });
        mockProduct002 = createProduct({ seed: 2, images: [] });
        mockProduct003 = createProduct({ seed: 3, images: [] });

        mockOrder001 = createOrder({ seed: 1, products: [mockProduct001] });
        mockOrder002 = createOrder({ seed: 1, products: [mockProduct002, mockProduct003] });

        mockOrders = [mockOrder001, mockOrder002];
    });

    it("List orders; No args; Success;", async () => {
        const EXPECT = mockOrders;
        mockOrderDataAccess.listOrders.mockResolvedValue(ok(EXPECT));
        const command = new ListOrdersCommand({
            status: null,
            minTotal: null,
            maxTotal: null,
            createdBefore: null,
            createdAfter: null,
            id: null,
            productId: null,
            productHistoryId: null,
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.orders).toEqual(EXPECT);
        }
        expect(mockOrderDataAccess.listOrders).toHaveBeenCalledWith({
            status: null,
            minTotal: null,
            maxTotal: null,
            createdBefore: null,
            createdAfter: null,
            id: null,
            productId: null,
            productHistoryId: null,
        });
    });

    it("List orders; 1 arg; Success;", async () => {
        const EXPECT = mockOrders.filter((order) => order.total >= 2);
        mockOrderDataAccess.listOrders.mockResolvedValue(ok(EXPECT));
        const command = new ListOrdersCommand({
            status: null,
            minTotal: 2,
            maxTotal: null,
            createdBefore: null,
            createdAfter: null,
            id: null,
            productId: null,
            productHistoryId: null,
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.orders).toEqual(EXPECT);
        }
        expect(mockOrderDataAccess.listOrders).toHaveBeenCalledWith({
            status: null,
            minTotal: 2,
            maxTotal: null,
            createdBefore: null,
            createdAfter: null,
            id: null,
            productId: null,
            productHistoryId: null,
        });
    });

    it("List orders; All args; Success;", async () => {
        const EXPECT = [mockOrder001];
        mockOrderDataAccess.listOrders.mockResolvedValue(ok(EXPECT));
        const command = new ListOrdersCommand({
            status: mockOrder001.status.value,
            minTotal: mockOrder001.total,
            maxTotal: mockOrder001.total,
            createdBefore: mockOrder001.dateCreated,
            createdAfter: mockOrder001.dateCreated,
            id: mockOrder001.id,
            productId: mockOrder001.orderItems[0].productHistory.productId,
            productHistoryId: mockOrder001.orderItems[0].productHistory.id,
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.orders).toEqual(EXPECT);
        }
        expect(mockOrderDataAccess.listOrders).toHaveBeenCalledWith({
            status: mockOrder001.status.value,
            minTotal: mockOrder001.total,
            maxTotal: mockOrder001.total,
            createdBefore: mockOrder001.dateCreated,
            createdAfter: mockOrder001.dateCreated,
            id: mockOrder001.id,
            productId: mockOrder001.orderItems[0].productHistory.productId,
            productHistoryId: mockOrder001.orderItems[0].productHistory.id,
        });
    });

    it("List orders; Ignore invalid status; Success;", async () => {
        const EXPECT = mockOrders;
        mockOrderDataAccess.listOrders.mockResolvedValue(ok(EXPECT));
        const command = new ListOrdersCommand({
            status: "invalid-status-123",
            minTotal: null,
            maxTotal: null,
            createdBefore: null,
            createdAfter: null,
            id: null,
            productId: null,
            productHistoryId: null,
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.orders).toEqual(EXPECT);
        }
        expect(mockOrderDataAccess.listOrders).toHaveBeenCalledWith({
            status: null,
            minTotal: null,
            maxTotal: null,
            createdBefore: null,
            createdAfter: null,
            id: null,
            productId: null,
            productHistoryId: null,
        });
    });

    it("List orders; Data Access Error; Failure;", async () => {
        const mockError = new Error("Unexpected error");
        mockOrderDataAccess.listOrders.mockRejectedValue(mockError);

        const command = new ListOrdersCommand({
            status: null,
            minTotal: null,
            maxTotal: null,
            createdBefore: null,
            createdAfter: null,
            id: null,
            productId: null,
            productHistoryId: null,
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "Exception", data: mockError });
        }
    });
});
