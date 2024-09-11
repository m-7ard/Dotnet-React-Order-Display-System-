import IFormError from "../../../domain/models/IFormError";

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
        <div className="p-2 flex flex-col gap-1 bg-gray-100 border border-gray-400">
            <div
                className="
                    mixin-button-like 
                    mixin-button-sm 
                    theme-button-generic-white 
                    w-fit
                    relative"
            >
                <div className="pointer-events-none ">Add Image</div>
                <input
                    type="file"
                    multiple
                    className="opacity-0 absolute inset-0 cursor-pointer file:cursor-pointer h-full w-full"
                    onChange={async (e) => await uploadImages(e)}
                ></input>
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
    errors?: string[]
}) {
    const { generatedFileName, originalFileName, onDelete, errors } = props;

    return (
        <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-1">
                <div className="w-16 h-16 min-w-16 min-h-16 border border-gray-900 relative">
                    <img
                        className="absolute w-full h-full object-cover sm:object-contain"
                        src={`${import.meta.env.VITE_API_URL}/Media/${generatedFileName}`}
                        alt={originalFileName}
                    ></img>
                </div>
                <div className="flex flex-col gap-1 overflow-hidden p-1">
                    <div className="text-sm text-medium truncate">{originalFileName}</div>
                </div>
                <button
                    type="button"
                    onClick={onDelete}
                    className="button-like theme-button-generic-white flex items-center justify-center leading-none ml-auto my-auto p-0.5 border border-gray-900 w-6 h-6 min-w-6 min-h-6"
                >
                    ✖
                </button>
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
