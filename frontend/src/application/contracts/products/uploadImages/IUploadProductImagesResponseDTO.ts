import { Result } from "neverthrow";
import IPlainApiError from "../../../interfaces/IPlainApiError";

type IUploadProductImagesResponseDTO = Result<{
    images: string[];
}, IPlainApiError>

export default IUploadProductImagesResponseDTO; 