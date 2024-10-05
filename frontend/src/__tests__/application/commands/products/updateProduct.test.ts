import { err, ok } from "neverthrow";
import IProduct from "../../../../domain/models/IProduct";
import { mockProductDataAccess } from "../../../../__mocks__/dataAccess";
import IPlainApiError from "../../../../application/interfaces/IPlainApiError";
import UpdateProductHandler from "../../../../application/commands/products/updateProduct/UpdateProductHandler";
import UpdateProductCommand from "../../../../application/commands/products/updateProduct/UpdateProductCommand";
import { createProduct } from "../../../../__utils__/mixins";

describe("UpdateProductHandler", () => {
    let handler: UpdateProductHandler;
    let mockProduct: IProduct;

    beforeEach(() => {
        handler = new UpdateProductHandler({
            productDataAccess: mockProductDataAccess,
        });
        mockProduct = createProduct({ seed: 1, images: [] });
    });

    it("Update product; Valid data; Success;", async () => {
        const updatedMockProduct = { ...mockProduct };
        updatedMockProduct.name += " Updated";

        mockProductDataAccess.updateProduct.mockResolvedValue(ok(updatedMockProduct));

        const command = new UpdateProductCommand({
            id: updatedMockProduct.id,
            name: updatedMockProduct.name,
            price: updatedMockProduct.price,
            description: updatedMockProduct.description,
            images: updatedMockProduct.images.map((image) => image.fileName)
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.product).toEqual(updatedMockProduct);
        }
        expect(mockProductDataAccess.updateProduct).toHaveBeenCalledWith({
            id: updatedMockProduct.id,
            name: updatedMockProduct.name,
            price: updatedMockProduct.price,
            description: updatedMockProduct.description,
            images: updatedMockProduct.images.map((image) => image.fileName)
        });
    });

    it("Update product; Invalid data; Failure;", async () => {
        const updatedMockProduct = { ...mockProduct };
        updatedMockProduct.name += " Updated";

        const mockError: IPlainApiError = [{ fieldName: "", path: "_", message: "form error" }];
        mockProductDataAccess.updateProduct.mockResolvedValue(err(mockError));

        const command = new UpdateProductCommand({
            id: 0,
            name: updatedMockProduct.name,
            price: updatedMockProduct.price,
            description: updatedMockProduct.description,
            images: updatedMockProduct.images.map((image) => image.fileName)
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "API", data: mockError });
        }
    });

    it("Update Product; Data Access Error; Failure;", async () => {
        const mockError = new Error("Unexpected error");
        mockProductDataAccess.updateProduct.mockRejectedValue(mockError);

        const command = new UpdateProductCommand({
            id: mockProduct.id,
            name: mockProduct.name,
            price: mockProduct.price,
            description: mockProduct.description,
            images: mockProduct.images.map((image) => image.fileName)
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "Exception", data: mockError });
        }
    });
});
