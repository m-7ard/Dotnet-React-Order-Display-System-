import { err, ok } from "neverthrow";
import IProduct from "../../../../domain/models/IProduct";
import { mockOrderDataAccess } from "../../../../__mocks__/dataAccess";
import Order from "../../../../domain/models/Order";
import IPlainApiError from "../../../../application/interfaces/IPlainApiError";
import ReadOrderHandler from "../../../../application/commands/orders/readOrder/ReadOrderHandler";
import ReadOrderCommand from "../../../../application/commands/orders/readOrder/ReadOrderCommand";
import { MockOrderStateManager } from "../../../../__mocks__/stateManagers";
import { createOrder, createProduct } from "../../../../__utils__/mixins";

describe("ReadOrderHandler", () => {
    let handler: ReadOrderHandler;
    let mockProduct001: IProduct;
    let mockOrder: Order;
    let mockOrderStateManager: MockOrderStateManager;

    beforeEach(() => {
        mockOrderStateManager = new MockOrderStateManager();
        handler = new ReadOrderHandler({
            orderDataAccess: mockOrderDataAccess,
            orderStateManager: mockOrderStateManager,
        });
        mockProduct001 = createProduct({ seed: 1, images: [] });
        mockOrder = createOrder({ seed: 1, products: [mockProduct001] });
    });

    it("Read order; Valid id & uncached; Success;", async () => {
        mockOrderDataAccess.readOrder.mockResolvedValue(ok(mockOrder));

        const command = new ReadOrderCommand({
            orderId: mockOrder.id,
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.order).toEqual(mockOrder);
        }
        expect(mockOrderDataAccess.readOrder).toHaveBeenCalledWith({
            id: mockOrder.id,
        });
    });

    it("Read order; Valid id & cached; Success;", async () => {
        mockOrderStateManager.setOrder(mockOrder);

        const command = new ReadOrderCommand({
            orderId: mockOrder.id,
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.order).toEqual(mockOrder);
        }
        expect(mockOrderStateManager.getOrder).toHaveBeenCalledWith(mockOrder.id);
    });

    it("Read order; Invalid id; Success;", async () => {
        const mockError: IPlainApiError = [{ fieldName: "", path: "_", message: "form error" }];
        mockOrderDataAccess.readOrder.mockResolvedValue(err(mockError));

        const command = new ReadOrderCommand({
            orderId: 0,
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "API", data: mockError });
        }
    });

    it("Read order; Invalid data; Failure;", async () => {
        const mockError: IPlainApiError = [{ fieldName: "", path: "_", message: "form error" }];
        mockOrderDataAccess.readOrder.mockResolvedValue(err(mockError));

        const command = new ReadOrderCommand({
            orderId: 0,
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "API", data: mockError });
        }
    });

    it("Read order; Data Access Error; Failure;", async () => {
        const mockError = new Error("Unexpected error");
        mockOrderDataAccess.readOrder.mockRejectedValue(mockError);

        const command = new ReadOrderCommand({
            orderId: 123,
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "Exception", data: mockError });
        }
    });
});
