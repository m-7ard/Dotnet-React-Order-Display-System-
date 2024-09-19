import { Result } from "neverthrow";
import IApplicationErrors from "../../../interfaces/IApplicationErrors";
import IImageData from "../../../../domain/models/IImageData";

type IUploadDraftImagesResult = Result<{
    images: IImageData[]
}, IApplicationErrors>;

export default IUploadDraftImagesResult;
