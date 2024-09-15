import IFormError from "../../../domain/models/IFormError";
import CoverImage from "../Resuables/CoverImage";
import MixinButton from "../Resuables/MixinButton";

export type OriginalFileName = string & { _: "orignalFileName" };
export type GeneratedFileName = string & { _: "generatedFileName" };

export default function UploadImagesForm(props: {
    onDelete: (generatedFileName: GeneratedFileName) => void;
    onSubmit: (files: File[]) => Promise<void>;
    errors?: IFormError<{ [generatedFileName: GeneratedFileName]: string[] }>;
    value: Record<GeneratedFileName, OriginalFileName>;
}) {
    const { onDelete, onSubmit, errors, value } = props;

    async function uploadImages(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        event.preventDefault();

        const { files } = event.target;
        if (files == null) {
            return;
        }

        await onSubmit([...files]);
        event.target.value = "";
    }

    return (
        <div className="bg-gray-50 divide-y divide-gray-300 rounded shadow border-gray-300 border">
            <div className="p-2 px-4">
                <MixinButton
                    className="rounded shadow w-fit overflow-hidden relative"
                    type="button"
                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                >
                    <div className="pointer-events-none ">Add Image</div>
                    <input
                        type="file"
                        multiple
                        className="opacity-0 absolute inset-0 cursor-pointer file:cursor-pointer h-full w-full"
                        onChange={async (e) => await uploadImages(e)}
                    ></input>
                </MixinButton>
            </div>
            {Object.entries(value).map((entries) => {
                const generatedFileName = entries[0] as GeneratedFileName;
                const originalFileName: OriginalFileName = entries[1];

                return (
                    <Image
                        errors={errors?.[generatedFileName]}
                        generatedFileName={generatedFileName}
                        originalFileName={originalFileName}
                        onDelete={() => onDelete(generatedFileName)}
                        key={generatedFileName}
                    />
                );
            })}
        </div>
    );
}

function Image(props: {
    generatedFileName: GeneratedFileName;
    originalFileName: OriginalFileName;
    onDelete: () => void;
    errors?: string[];
}) {
    const { generatedFileName, originalFileName, onDelete, errors } = props;

    return (
        <div className="flex flex-col gap-2 p-2 px-4">
            <div className="flex flex-row gap-2">
                <CoverImage
                    className="w-16 h-16 min-w-16 min-h-16 border border-gray-300 rounded overflow-hidden"
                    src={`${import.meta.env.VITE_API_URL}/Media/${generatedFileName}`}
                />
                <div className="flex flex-col gap-1 overflow-hidden grow">
                    <div className="text-sm text-medium truncate">{originalFileName}</div>
                    <MixinButton
                        className="ml-auto mt-auto justify-center rounded shadow"
                        type="button"
                        onClick={onDelete}
                        options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                    >
                        Remove
                    </MixinButton>
                </div>
            </div>
            {errors == null ? null : (
                <div className="flex flex-col gap-0.5">
                    {errors.map((message) => (
                        <div className="text-xs text-red-700" key={message}>
                            {message}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
