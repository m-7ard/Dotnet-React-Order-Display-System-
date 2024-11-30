import { useApplicationExceptionContext } from "./Application.ExceptionProvider.Context";

export default function ApplicationExceptionNotice() {
    const { exception, dismissException } = useApplicationExceptionContext();

    if (exception == null) {
        return null;
    }

    return (
        <div className="fixed mx-auto top-4 left-4 right-4 flex flex-col bg-red-400 border border-gray-900 p-4 gap-4 text-gray-900 max-w-96" style={{ zIndex: 1000000 }}>
            <div className="flex flex-row gap-4 justify-between items-center">
                <div className="text-sm">{exception.message}</div>
                <div className="mixin-button-like" onClick={dismissException}>
                    ✖
                </div>
            </div>
        </div>
    );
}
