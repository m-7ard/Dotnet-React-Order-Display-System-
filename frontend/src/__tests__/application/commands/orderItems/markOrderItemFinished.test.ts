import { err, ok } from "neverthrow";
import IProduct from "../../../../domain/models/IProduct";
import { mockOrderDataAccess } from "../../../../__mocks__/dataAccess";
import Order from "../../../../domain/models/Order";
import IPlainApiError from "../../../../application/interfaces/IPlainApiError";
import OrderItemStatus from "../../../../domain/valueObjects/OrderItem/OrderItemStatus";
import MarkOrderItemFinishedHandler from "../../../../application/commands/orderItems/markFinished/MarkOrderItemFinishedHandler";
import OrderItem from "../../../../domain/models/OrderItem";
import MarkOrderItemFinishedCommand from "../../../../application/commands/orderItems/markFinished/MarkOrderItemFinishedCommand";
import { createProduct, createOrder } from "../../../../__utils__/mixins";

describe("MarkOrderItemFinishedHandler", () => {
    let handler: MarkOrderItemFinishedHandler;
    let mockProduct001: IProduct;
    let mockOrder: Order;
    let mockOrderItem: OrderItem;

    beforeEach(() => {
        handler = new MarkOrderItemFinishedHandler({ orderDataAccess: mockOrderDataAccess });
        mockProduct001 = createProduct({ seed: 1, images: [] });
        mockOrder = createOrder({ seed: 1, products: [mockProduct001] });
        mockOrderItem = mockOrder.orderItems[0];
    });

    it("Mark OrderItem finished; Valid data; Success;", async () => {
        mockOrderItem.status = OrderItemStatus.FINISHED;
        mockOrderItem.dateFinished = new Date();
        mockOrderDataAccess.markOrderItemFinished.mockResolvedValue(ok(mockOrder));

        const command = new MarkOrderItemFinishedCommand({
            orderId: mockOrder.id,
            orderItemId: mockOrderItem.id
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.order).toEqual(mockOrder);
        }
        expect(mockOrderDataAccess.markOrderItemFinished).toHaveBeenCalledWith({
            orderId: mockOrder.id,
            orderItemId: mockOrderItem.id
        });
    });

    it("Mark OrderItem finished; Invalid data; Failure;", async () => {
        const mockError: IPlainApiError = [{ fieldName: "", path: "_", message: "form error" }];
        mockOrderDataAccess.markOrderItemFinished.mockResolvedValue(err(mockError));
        
        const command = new MarkOrderItemFinishedCommand({
            orderId: 0,
            orderItemId: 0
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "API", data: mockError });
        }
    });

    it("Mark OrderItem finished; Data Access Error; Failure;", async () => {
        const mockError = new Error("Unexpected error");
        mockOrderDataAccess.markOrderItemFinished.mockRejectedValue(mockError);

        const command = new MarkOrderItemFinishedCommand({
            orderId: 123,
            orderItemId: 123
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "Exception", data: mockError });
        }
    });
});
