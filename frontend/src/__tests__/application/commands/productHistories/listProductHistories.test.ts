import { ok } from "neverthrow";
import ListProductHistoriesHandler from "../../../../application/commands/productHistories/list/ListProductHistoriesHandler";
import { mockProductHistoryDataAccess } from "../../../../__mocks__/dataAccess";
import { createProductAndHistory } from "../../../../__utils__/mixins";
import IProductHistory from "../../../../domain/models/IProductHistory";
import ListProductHistoriesCommand from "../../../../application/commands/productHistories/list/ListProductHistoriesCommand";

describe("ListProductHistoriesHandler", () => {
    let handler: ListProductHistoriesHandler;
    let mockProductHistories: IProductHistory[];

    beforeEach(() => {
        handler = new ListProductHistoriesHandler({ productHistoryDataAccess: mockProductHistoryDataAccess });
        mockProductHistories = [createProductAndHistory({ seed: 1, images: [] }), createProductAndHistory({ seed: 2, images: [] })].map((tuple) => tuple[1]);
    });

    it("List all products; No Args; Success;", async () => {
        mockProductHistoryDataAccess.listProductHistories.mockResolvedValue(ok(mockProductHistories));

        const command = new ListProductHistoriesCommand({
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            validFrom: null,
            validTo: null,
            productId: null
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.productHistories.length).toEqual(2);
        }
        expect(mockProductHistoryDataAccess.listProductHistories).toHaveBeenCalledWith({
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            validFrom: null,
            validTo: null,
            productId: null
        });
    });

    it("List all products; With 1 Arg; Success;", async () => {
        mockProductHistoryDataAccess.listProductHistories.mockResolvedValue(ok(mockProductHistories.filter((product) => product.price >= 2)));

        const command = new ListProductHistoriesCommand({
            name: null,
            minPrice: 2,
            maxPrice: null,
            description: null,
            validFrom: null,
            validTo: null,
            productId: null
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.productHistories.length).toEqual(1);
        }

        expect(mockProductHistoryDataAccess.listProductHistories).toHaveBeenCalledWith({
            name: null,
            minPrice: 2,
            maxPrice: null,
            description: null,
            validFrom: null,
            validTo: null,
            productId: null
        });
    });

    it("List all products; With All Arg; Success;", async () => {
        const mockProductHistory = mockProductHistories[0];
        mockProductHistoryDataAccess.listProductHistories.mockResolvedValue(ok([mockProductHistory]));

        const command = new ListProductHistoriesCommand({
            name: mockProductHistory.name,
            minPrice: mockProductHistory.price,
            maxPrice: mockProductHistory.price,
            description: mockProductHistory.description,
            validFrom: mockProductHistory.validFrom,
            validTo: mockProductHistory.validTo,
            productId: mockProductHistory.productId
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.productHistories.length).toEqual(1);
        }

        expect(mockProductHistoryDataAccess.listProductHistories).toHaveBeenCalledWith({
            name: mockProductHistory.name,
            minPrice: mockProductHistory.price,
            maxPrice: mockProductHistory.price,
            description: mockProductHistory.description,
            validFrom: mockProductHistory.validFrom,
            validTo: mockProductHistory.validTo,
            productId: mockProductHistory.productId
        });
    });

    it("List All Products; Data Access Error; Failure;", async () => {
        const mockError = new Error("Unexpected error");
        mockProductHistoryDataAccess.listProductHistories.mockRejectedValue(mockError);

        const command = new ListProductHistoriesCommand({
            name: null,
            minPrice: null,
            maxPrice: null,
            description: null,
            validFrom: null,
            validTo: null,
            productId: null
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "Exception", data: mockError });
        }
    });
});
