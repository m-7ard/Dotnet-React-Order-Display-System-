import { err, ok } from "neverthrow";
import IPlainApiError from "../../../../application/interfaces/IPlainApiError";
import IProduct from "../../../../domain/models/IProduct";
import { mockProductDataAccess } from "../../../../__mocks__/dataAccess";
import DeleteProductHandler from "../../../../application/commands/products/deleteProduct/DeleteProductHandler";
import DeleteProductCommand from "../../../../application/commands/products/deleteProduct/DeleteProductCommand";
import { createProduct } from "../../../../__utils__/mixins";

describe("DeleteProductHandlerProductHandler", () => {
    let handler: DeleteProductHandler;
    let mockProduct: IProduct;

    beforeEach(() => {
        handler = new DeleteProductHandler({ productDataAccess: mockProductDataAccess });
        mockProduct = createProduct({ seed: 1, images: [] });
    });

    it("Delete product; Valid id; Success;", async () => {
        mockProductDataAccess.deleteProduct.mockResolvedValue(ok(null));

        const command = new DeleteProductCommand({
            id: mockProduct.id
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toBeNull();
        }
        expect(mockProductDataAccess.deleteProduct).toHaveBeenCalledWith({
            id: mockProduct.id
        });
    });

    it("Delete product; Invalid Id; Failure;", async () => {
        const mockError: IPlainApiError = [{ fieldName: "", path: "_", message: "form error" }];
        mockProductDataAccess.deleteProduct.mockResolvedValue(err(mockError));

        const command = new DeleteProductCommand({
            id: 0
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "API", data: mockError });
        }
    });

    it("Delete product; Data Access Error; Failure;", async () => {
        const mockError = new Error("Unexpected error");

        mockProductDataAccess.deleteProduct.mockRejectedValue(mockError);

        const command = new DeleteProductCommand({
            id: mockProduct.id
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "Exception", data: mockError });
        }
    });
});
