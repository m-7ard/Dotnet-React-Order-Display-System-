import { err, ok } from "neverthrow";
import CreateProductCommand from "../../../../application/commands/products/createProduct/CreateProductCommand";
import CreateProductHandler from "../../../../application/commands/products/createProduct/CreateProductHandler";
import IPlainApiError from "../../../../application/interfaces/IPlainApiError";
import IProduct from "../../../../domain/models/IProduct";
import { mockProductDataAccess } from "../../../../__mocks__/dataAccess";
import { createProduct } from "../../../../__utils__/mixins";

describe("CreateProductHandler", () => {
    let handler: CreateProductHandler;
    let mockProduct: IProduct;

    beforeEach(() => {
        handler = new CreateProductHandler({ productDataAccess: mockProductDataAccess });
        mockProduct = createProduct({ seed: 1, images: [] });
    });

    it("Create product; Valid data; Success;", async () => {
        mockProductDataAccess.createProduct.mockResolvedValue(ok(mockProduct));

        const command = new CreateProductCommand({
            name: mockProduct.name,
            price: mockProduct.price,
            description: mockProduct.description,
            images: mockProduct.images.map(({ fileName }) => fileName),
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.product).toEqual(mockProduct);
        }
        expect(mockProductDataAccess.createProduct).toHaveBeenCalledWith({
            name: mockProduct.name,
            price: mockProduct.price,
            description: mockProduct.description,
            images: mockProduct.images.map(({ fileName }) => fileName),
        });
    });

    it("Create product; Invalid data; Failure;", async () => {
        const mockError: IPlainApiError = [{ fieldName: "", path: "_", message: "form error" }];
        mockProductDataAccess.createProduct.mockResolvedValue(err(mockError));

        const command = new CreateProductCommand({
            name: "",
            price: 9.99,
            description: "A test product",
            images: ["image1.jpg", "image2.jpg"],
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "API", data: mockError });
        }
    });

    it("Create product; Data Access Error; Failure;", async () => {
        const mockError = new Error("Unexpected error");
        mockProductDataAccess.createProduct.mockRejectedValue(mockError);

        const command = new CreateProductCommand({
            name: "Test Product",
            price: 9.99,
            description: "A test product",
            images: ["image1.jpg", "image2.jpg"],
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "Exception", data: mockError });
        }
    });
});
