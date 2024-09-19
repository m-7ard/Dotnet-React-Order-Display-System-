import ICommand from "../../ICommand";
import IUploadDraftImagesResult from "./IUploadDraftImagesResult";

export default class UploadDraftImagesCommand implements ICommand<IUploadDraftImagesResult> {
    __returnType: IUploadDraftImagesResult = null!;

    constructor(props: {
        files: File[]
    }) {
        this.files = props.files;
    }

    public files: File[];
}
