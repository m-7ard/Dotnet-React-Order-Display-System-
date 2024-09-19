import { err, ok, Result } from "neverthrow";
import IUploadDraftImagesRequestDTO from "../../application/contracts/draftImages/uploadImages/IUploadDraftImagesRequestDTO";
import IUploadDraftImagesResponseDTO from "../../application/contracts/draftImages/uploadImages/IUploadDraftImagesResponseDTO";
import handleResponse from "../utils/handleResponse";
import IPlainApiError from "../../application/interfaces/IPlainApiError";
import IDraftImageDataAccess from "../../application/interfaces/dataAccess/IDraftImageDataAccess";
import IImageData from "../../domain/models/IImageData";
import ImageDataMapper from "../mappers/productImageMapper";

export default class DraftImageDataAccess implements IDraftImageDataAccess {
    private readonly _apiRoute = "http://localhost:5102/api/draft_images";
    
    async uploadImages(request: IUploadDraftImagesRequestDTO): Promise<Result<IImageData[], IPlainApiError>> {
        const formData = new FormData();
        request.files.forEach((file) => formData.append("Files", file));
        
        const response = await fetch(`${this._apiRoute}/upload_images`, {
            method: "POST",
            body: formData
        });

        const { isOk, data } = await handleResponse<IUploadDraftImagesResponseDTO, IPlainApiError>({
            response,
            onOk: async (res) => await res.json(),
            onError: async (res) => await res.json(),
        });
        console.log(data)

        return isOk ? ok(data.images.map(ImageDataMapper.apiToDomain)) : err(data);
    }
}