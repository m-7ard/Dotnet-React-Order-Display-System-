import ICommand from "../../ICommand";
import IUploadProductImagesResult from "./IUploadProductImagesResult";

export default class UploadProductImagesCommand implements ICommand<IUploadProductImagesResult> {
    __returnType: IUploadProductImagesResult = null!;

    constructor(props: {
        files: File[]
    }) {
        this.files = props.files;
    }

    public files: File[];
}
