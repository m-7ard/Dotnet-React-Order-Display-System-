import IFormError from "../../domain/models/IFormError";

export type OriginalFileName = string & { _: "orignalFileName" };
export type GeneratedFileName = string & { _: "generatedFileName" };

export default function UploadImagesForm(props: {
    onDelete: (generatedFileName: GeneratedFileName) => void;
    onSubmit: (files: File[]) => Promise<void>;
    errors?: IFormError<{ [generatedFileName: GeneratedFileName]: string[] }>;
    value: Record<GeneratedFileName, OriginalFileName>;
}) {
    async function uploadImages(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        event.preventDefault();

        const { files } = event.target;
        if (files == null) {
            return;
        }

        await props.onSubmit([...files]);
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
            {Object.entries(props.value).map((entries) => {
                const generatedFileName = entries[0] as GeneratedFileName;
                const originalFileName: OriginalFileName = entries[1];

                return (
                    <Image
                        generatedFileName={generatedFileName}
                        originalFileName={originalFileName}
                        onDelete={() => props.onDelete(generatedFileName)}
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
}) {
    return (
        <div className="flex flex-row gap-1">
            <div className="w-16 h-16 min-w-16 min-h-16 border border-gray-900 relative">
                <img
                    className="absolute w-full h-full object-cover sm:object-contain"
                    src={`http://localhost:5196/Media/${props.generatedFileName}`}
                    alt={props.originalFileName}
                ></img>
            </div>
            <div className="flex flex-col gap-1 overflow-hidden p-1">
                <div className="text-sm text-medium truncate">{props.originalFileName}</div>
            </div>
            <button
                type="button"
                onClick={props.onDelete}
                className="button-like theme-button-generic-white flex items-center justify-center leading-none ml-auto my-auto p-0.5 border border-gray-900 w-6 h-6 min-w-6 min-h-6"
            >
                ✖
            </button>
        </div>
    );
}
