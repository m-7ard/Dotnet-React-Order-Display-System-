import { ok } from "neverthrow";
import IProduct from "../../../../domain/models/IProduct";
import ListProductsCommand from "../../../../application/commands/products/listProducts/ListProductsCommand";
import ListProductHistoriesHandler from "../../../../application/commands/productHistories/list/ListProductHistoriesHandler";
import { mockProductHistoryDataAccess } from "../../../../__mocks__/dataAccess";
import { createProduct } from "../../../../__utils__/mixins";

describe("ListProductHistoriesHandler", () => {
    let handler: ListProductHistoriesHandler;
    let mockProducts: IProduct[];

    beforeEach(() => {
        handler = new ListProductHistoriesHandler({ productHistoryDataAccess: mockProductHistoryDataAccess });
        mockProducts = [createProduct({ seed: 1, images: [] }), createProduct({ seed: 2, images: [] })];
    });

    it("List all products; No Args; Success;", async () => {
        mockProductHistoryDataAccess.listProductHistories.mockResolvedValue(ok(mockProducts));

        const command = new ListProductsCommand({
            id: null,
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null,
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.products.length).toEqual(2);
        }
        expect(mockProductHistoryDataAccess.listProductHistories).toHaveBeenCalledWith({
            id: null,
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null,
        });
    });

    it("List all products; With 1 Arg; Success;", async () => {
        mockProductHistoryDataAccess.listProductHistories.mockResolvedValue(ok(mockProducts.filter((product) => product.price >= 2)));

        const command = new ListProductsCommand({
            id: null,
            name: null,
            minPrice: 2,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null,
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.products.length).toEqual(1);
        }

        expect(mockProductHistoryDataAccess.listProductHistories).toHaveBeenCalledWith({
            id: null,
            name: null,
            minPrice: 2,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null,
        });
    });

    it("List all products; With All Arg; Success;", async () => {
        const mockProduct = mockProducts[0];
        mockProductHistoryDataAccess.listProductHistories.mockResolvedValue(ok([mockProduct]));

        const command = new ListProductsCommand({
            id: mockProduct.id,
            name: mockProduct.name,
            minPrice: mockProduct.price,
            maxPrice: mockProduct.price,
            description: mockProduct.description,
            createdBefore: mockProduct.dateCreated,
            createdAfter: mockProduct.dateCreated,
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.products.length).toEqual(1);
        }

        expect(mockProductHistoryDataAccess.listProductHistories).toHaveBeenCalledWith({
            id: mockProduct.id,
            name: mockProduct.name,
            minPrice: mockProduct.price,
            maxPrice: mockProduct.price,
            description: mockProduct.description,
            createdBefore: mockProduct.dateCreated,
            createdAfter: mockProduct.dateCreated,
        });
    });

    it("List All Products; Data Access Error; Failure;", async () => {
        const mockError = new Error("Unexpected error");
        mockProductHistoryDataAccess.listProductHistories.mockRejectedValue(mockError);

        const command = new ListProductsCommand({
            id: null,
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            createdBefore: null,
            createdAfter: null,
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "Exception", data: mockError });
        }
    });
});
