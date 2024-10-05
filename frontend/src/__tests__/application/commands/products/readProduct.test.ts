import { err, ok } from "neverthrow";
import IProduct from "../../../../domain/models/IProduct";
import { mockProductDataAccess } from "../../../../__mocks__/dataAccess";
import ReadProductHandler from "../../../../application/commands/products/readProduct/ReadProductHandler";
import { MockProductStateManager } from "../../../../__mocks__/stateManagers";
import ReadProductCommand from "../../../../application/commands/products/readProduct/ReadProductCommand";
import IPlainApiError from "../../../../application/interfaces/IPlainApiError";
import { createProduct } from "../../../../__utils__/mixins";

describe("ReadProductHandler", () => {
    let handler: ReadProductHandler;
    let mockProduct: IProduct;
    let mockProductStateManager: MockProductStateManager;

    beforeEach(() => {
        mockProductStateManager = new MockProductStateManager();
        handler = new ReadProductHandler({
            productDataAccess: mockProductDataAccess,
            productStateManager: mockProductStateManager,
        });
        mockProduct = createProduct({ seed: 1, images: [] });
    });

    it("Read product; Valid id & Uncached; Success;", async () => {
        mockProductDataAccess.readProduct.mockResolvedValue(ok(mockProduct));

        const command = new ReadProductCommand({
            productId: mockProduct.id,
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.product).toEqual(mockProduct);
        }
        expect(mockProductDataAccess.readProduct).toHaveBeenCalledWith({
            id: mockProduct.id,
        });
    });

    it("Read product; Valid id & cached; Success;", async () => {
        mockProductStateManager.setProduct(mockProduct);

        const command = new ReadProductCommand({
            productId: mockProduct.id,
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.product).toEqual(mockProduct);
        }
        expect(mockProductStateManager.getProduct).toHaveBeenCalledWith(mockProduct.id);
    });

    it("Read product; Invalid id; Failure;", async () => {
        const mockError: IPlainApiError = [{ fieldName: "", path: "_", message: "form error" }];
        mockProductDataAccess.readProduct.mockResolvedValue(err(mockError));

        const command = new ReadProductCommand({
            productId: 0,
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "API", data: mockError });
        }
    });

    it("Read Product; Data Access Error; Failure;", async () => {
        const mockError = new Error("Unexpected error");
        mockProductDataAccess.readProduct.mockRejectedValue(mockError);

        const command = new ReadProductCommand({
            productId: 1,
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "Exception", data: mockError });
        }
    });
});
