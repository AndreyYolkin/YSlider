import Observable from "../Observable/Observable";
import Options from "../Options";

export class Slider extends Observable {
    root: HTMLElement;

    private options: Options;
    constructor(options: Options, root: HTMLElement) {
        super();
        this.options = options;
        this.root = root;
    }

    _createElement(name: string = "div", attributes?: any) {
        const element = document.createElement(name);
        
        Object.keys(attributes).forEach(attribute => {
            element.setAttribute(attribute, attributes[attribute]);
        })

        return element;
    }

    draw(root: HTMLElement, options: Options) {
        root.appendChild(this._createElement("div", {class: `y-slider y-slider_${options.orientation}`}))
    }
}

export default Slider