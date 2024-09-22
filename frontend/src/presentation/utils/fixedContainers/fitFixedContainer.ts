export default function fitFixedContainer(element: HTMLElement) {
    let elementDimensions = element.getBoundingClientRect();

    if (elementDimensions.bottom > document.body.clientHeight) {
        element.style.bottom = "0px";
        element.style.top =
            element.offsetHeight >= document.body.offsetHeight
                ? "0px"
                : `${document.body.offsetHeight - elementDimensions.height}px`;
    }

    elementDimensions = element.getBoundingClientRect();
    if (elementDimensions.top < 0) {
        element.style.top = "0px";
        element.style.bottom =
            element.offsetHeight >= document.body.offsetHeight
                ? "0px"
                : `${document.body.offsetHeight - elementDimensions.height}px`;
    }

    elementDimensions = element.getBoundingClientRect();
    if (elementDimensions.right > document.body.clientWidth) {
        element.style.right = "0px";
    }

    elementDimensions = element.getBoundingClientRect();
    if (elementDimensions.left < 0) {
        element.style.left = "0px";
    }
}