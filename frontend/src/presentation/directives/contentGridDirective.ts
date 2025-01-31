import Directive from "../types/Directive";

const contentGridDirective: Directive = () => {
    return (data) => {
        const newData = { ...data };
        data.classNames.push("mixin-content-grid");
        return newData;
    };
};

export default contentGridDirective;
