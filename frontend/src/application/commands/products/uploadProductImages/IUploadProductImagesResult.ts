import { Result } from "neverthrow";
import IApplicationErrors from "../../../interfaces/IApplicationErrors";

type IUploadProductImagesResult = Result<{
    images: string[] 
}, IApplicationErrors>;

export default IUploadProductImagesResult;
