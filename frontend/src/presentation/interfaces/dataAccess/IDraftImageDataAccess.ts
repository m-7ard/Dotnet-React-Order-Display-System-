import IUploadDraftImagesRequestDTO from "../../../application/contracts/draftImages/uploadImages/IUploadDraftImagesRequestDTO";

export default interface IDraftImageDataAccess {
    uploadImages(request: IUploadDraftImagesRequestDTO): Promise<Response>;
}
