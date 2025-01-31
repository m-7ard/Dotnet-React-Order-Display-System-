import Directive from "../types/Directive";

const contentGridTrackDirective: Directive<["sm" | "base" | "lg" | "full"]> = (track) => {
    return (data) => {
        const newData = { ...data };
        data.attrs["data-track"] = track;
        return newData;
    };
};

export default contentGridTrackDirective;
