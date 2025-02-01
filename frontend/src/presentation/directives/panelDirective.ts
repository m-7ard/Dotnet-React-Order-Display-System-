import Directive from "../types/Directive";

const OPTIONS = {
    SIZE: {
        BASE: "mixin-panel-base",
    },
};

export type PanelDirectiveExpression = (options: typeof OPTIONS) => { size: string; hasShadow?: boolean; hasBorder?: boolean };

const panelDirective: Directive<[PanelDirectiveExpression]> = (options) => {
    return (data) => {
        const newData = { ...data };
        const { size, hasBorder = false, hasShadow = false } = options(OPTIONS);

        data.classNames.push("mixin-panel-like");
        data.classNames.push(size);

        if (hasBorder) {
            data.classNames.push("border token-default-border-color");
        }

        if (hasShadow) {
            data.classNames.push("token-default-shadow");
        }

        return newData;
    };
};

export default panelDirective;
