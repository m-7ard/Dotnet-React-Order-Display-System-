import IUploadDraftImagesRequestDTO from "../../contracts/draftImages/uploadImages/IUploadDraftImagesRequestDTO";

export default interface IDraftImageDataAccess {
    uploadImages(request: IUploadDraftImagesRequestDTO): Promise<Response>;
}
