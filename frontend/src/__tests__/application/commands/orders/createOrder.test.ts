import { err, ok } from "neverthrow";
import IProduct from "../../../../domain/models/IProduct";
import { mockOrderDataAccess } from "../../../../__mocks__/dataAccess";
import CreateOrderHandler from "../../../../application/commands/orders/createOrder/CreateOrderHandler";
import Order from "../../../../domain/models/Order";
import createOrder from "../../../../__utils__/createOrder";
import CreateOrderCommand from "../../../../application/commands/orders/createOrder/CreateOrderCommand";
import IPlainApiError from "../../../../application/interfaces/IPlainApiError";
import { createProduct } from "../../../../__utils__/mixins";

describe("CreateOrderHandler", () => {
    let handler: CreateOrderHandler;
    let mockProduct001: IProduct;
    let mockOrder: Order;

    beforeEach(() => {
        handler = new CreateOrderHandler({ orderDataAccess: mockOrderDataAccess });
        mockProduct001 = createProduct({ seed: 1, images: [] });
        mockOrder = createOrder({ seed: 1, products: [mockProduct001] });
    });

    it("Create order; Valid data; Success;", async () => {
        mockOrderDataAccess.createOrder.mockResolvedValue(ok(mockOrder));
        const orderItemData = {
            UID1: {
                productId: mockProduct001.id,
                quantity: 1,
            },
        };

        const command = new CreateOrderCommand({
            orderItemData: orderItemData,
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.order).toEqual(mockOrder);
        }
        expect(mockOrderDataAccess.createOrder).toHaveBeenCalledWith({
            orderItemData: Object.entries(orderItemData).reduce((acc, [UID, data]) => {
                return { ...acc, [UID]: data };
            }, {}),
        });
    });

    it("Create order; Invalid data; Falure;", async () => {
        const mockError: IPlainApiError = [{ fieldName: "", path: "_", message: "form error" }];
        mockOrderDataAccess.createOrder.mockResolvedValue(err(mockError));
        
        const orderItemData = {
            UID1: {
                productId: 0,
                quantity: 0,
            },
        };

        const command = new CreateOrderCommand({
            orderItemData: orderItemData,
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "API", data: mockError });
        }
    });

    it("Create order; Data Access Error; Failure;", async () => {
        const mockError = new Error("Unexpected error");
        mockOrderDataAccess.createOrder.mockRejectedValue(mockError);

        const orderItemData = {
            UID1: {
                productId: 0,
                quantity: 0,
            },
        };

        const command = new CreateOrderCommand({
            orderItemData: orderItemData,
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "Exception", data: mockError });
        }
    });
});
