import { ICommandHandler } from "../../ICommandHandler";
import { err, ok } from "neverthrow";
import IUploadDraftImagesResult from "./IUploadDraftImagesResult";
import IDraftImageDataAccess from "../../../interfaces/dataAccess/IDraftImageDataAccess";
import UploadDraftImagesCommand from "./UploadDraftImagesCommand";

export default class UploadDraftImagesHandler implements ICommandHandler<UploadDraftImagesCommand, IUploadDraftImagesResult> {
    readonly _draftImageDataAccess: IDraftImageDataAccess;

    constructor(props: {
        draftImageDataAccess: IDraftImageDataAccess
    }) {
        this._draftImageDataAccess = props.draftImageDataAccess;
    }

    async handle(request: UploadDraftImagesCommand): Promise<IUploadDraftImagesResult> {
        try {
            const result = await this._draftImageDataAccess.uploadImages({
                files: request.files
            });

            if (result.isErr()) {
                return err({ type: "API", data: result.error });
            }

            return ok({ images: result.value });
        } catch (error: unknown) {
            return err({ type: "Exception", data: error });
        }
    }
}
