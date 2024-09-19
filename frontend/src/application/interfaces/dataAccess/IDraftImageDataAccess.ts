import { Result } from "neverthrow";
import IUploadDraftImagesRequestDTO from "../../contracts/draftImages/uploadImages/IUploadDraftImagesRequestDTO";
import IPlainApiError from "../IPlainApiError";
import IImageData from "../../../domain/models/IImageData";

export default interface IDraftImageDataAccess {
    uploadImages(request: IUploadDraftImagesRequestDTO): Promise<Result<IImageData[], IPlainApiError>>;
}
