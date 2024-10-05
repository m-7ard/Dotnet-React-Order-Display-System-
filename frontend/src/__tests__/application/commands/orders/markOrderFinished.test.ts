import { err, ok } from "neverthrow";
import IProduct from "../../../../domain/models/IProduct";
import { mockOrderDataAccess } from "../../../../__mocks__/dataAccess";
import Order from "../../../../domain/models/Order";
import IPlainApiError from "../../../../application/interfaces/IPlainApiError";
import MarkOrderFinishedHandler from "../../../../application/commands/orders/markFinished/MarkOrderFinishedHandler";
import MarkOrderFinishedCommand from "../../../../application/commands/orders/markFinished/MarkOrderFinishedCommand";
import OrderStatus from "../../../../domain/valueObjects/Order/OrderStatus";
import { createOrder, createProduct } from "../../../../__utils__/mixins";

describe("MarkOrderFinishedHandler", () => {
    let handler: MarkOrderFinishedHandler;
    let mockProduct001: IProduct;
    let mockOrder: Order;

    beforeEach(() => {
        handler = new MarkOrderFinishedHandler({ orderDataAccess: mockOrderDataAccess });
        mockProduct001 = createProduct({ seed: 1, images: [] });
        mockOrder = createOrder({ seed: 1, products: [mockProduct001] });
    });

    it("Mark order finished; Valid data; Success;", async () => {
        mockOrder.status = OrderStatus.FINISHED;
        mockOrder.dateFinished = new Date();
        mockOrderDataAccess.markOrderFinished.mockResolvedValue(ok(mockOrder));

        const command = new MarkOrderFinishedCommand({
            orderId: mockOrder.id
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.order).toEqual(mockOrder);
        }
        expect(mockOrderDataAccess.markOrderFinished).toHaveBeenCalledWith({
            orderId: mockOrder.id
        });
    });

    it("Mark order finished; Invalid data; Failure;", async () => {
        const mockError: IPlainApiError = [{ fieldName: "", path: "_", message: "form error" }];
        mockOrderDataAccess.markOrderFinished.mockResolvedValue(err(mockError));
        
        const command = new MarkOrderFinishedCommand({
            orderId: 0
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "API", data: mockError });
        }
    });

    it("Mark order finished; Data Access Error; Failure;", async () => {
        const mockError = new Error("Unexpected error");
        mockOrderDataAccess.markOrderFinished.mockRejectedValue(mockError);

        const command = new MarkOrderFinishedCommand({
            orderId: 123
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "Exception", data: mockError });
        }
    });
});
