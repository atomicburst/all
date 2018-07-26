

export const loadCss = function (css) {
    let style = document.createElement("style");
    style.innerHTML=css;
    document.head.appendChild(style);
}