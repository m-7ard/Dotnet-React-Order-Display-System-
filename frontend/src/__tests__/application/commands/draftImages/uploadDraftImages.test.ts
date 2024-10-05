import { err, ok } from "neverthrow";
import { mockDraftImageDataAccess } from "../../../../__mocks__/dataAccess";
import UploadDraftImagesHandler from "../../../../application/commands/draftImages/uploadProductImages/UploadDraftImagesHandler";
import UploadDraftImagesCommand from "../../../../application/commands/draftImages/uploadProductImages/UploadDraftImagesCommand";
import IImageData from "../../../../domain/models/IImageData";
import IPlainApiError from "../../../../application/interfaces/IPlainApiError";

describe("UploadDraftImagesHandler", () => {
    let handler: UploadDraftImagesHandler;
    let mockFiles: File[];

    beforeEach(() => {
        handler = new UploadDraftImagesHandler({ draftImageDataAccess: mockDraftImageDataAccess });
        mockFiles = [new File(["file content"], "test.jpg", { type: "image/jpeg" })];
    });

    it("Upload draft images; Valid data; Success;", async () => {
        const EXPECT: IImageData[] = mockFiles.map((file) => ({
            fileName: `saved_${file.name}`,
            originalFileName: file.name,
            url: `some.url`,
        }));
        mockDraftImageDataAccess.uploadImages.mockResolvedValue(ok(EXPECT));

        const command = new UploadDraftImagesCommand({
            files: mockFiles,
        });

        const result = await handler.handle(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value.images.length).toEqual(1);
        }
        expect(mockDraftImageDataAccess.uploadImages).toHaveBeenCalledWith({
            files: mockFiles,
        });
    });

    it("Upload draft images; Invalid data; Failure;", async () => {
        const mockError: IPlainApiError = [{ fieldName: "", path: "_", message: "form error" }];
        mockDraftImageDataAccess.uploadImages.mockResolvedValue(err(mockError));

        const command = new UploadDraftImagesCommand({
            files: [],
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "API", data: mockError });
        }
    });

    it("Upload draft images; Data Access Error; Failure;", async () => {
        const mockError = new Error("Unexpected error");
        mockDraftImageDataAccess.uploadImages.mockRejectedValue(mockError);

        const command = new UploadDraftImagesCommand({
            files: [],
        });

        const result = await handler.handle(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.error).toEqual({ type: "Exception", data: mockError });
        }
    });
});
